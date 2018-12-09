import functools
import time
import random

import boto3
from boto3.dynamodb.conditions import Key, Attr

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None

        table = boto3.resource('dynamodb').Table('users')
        if not username:
            error = 'Username is required'
        elif not password:
            error = 'Password is required'
        elif table.scan(
            FilterExpression=Attr('username').eq(username)  
        ) is not None:
            error = 'Username {} is already registered.'.format(username)

        if error is None:
            time = int(time.time())
            rand = random.randint(1,1000)
            unique_id = time + rand
            table.put_item(
                Item={
                    'id': unique_id,
                    'username': username,
                    'password': generate_password_hash(password),  
                }
            )

            return redirect(url_for('auth.login'))
        flash(error)

    return render_template('auth/register.html')

@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None
        table = boto3.resource('dynamodb').Table('users')

        reponse = table.scan(
            FilterExpressions=Attr('username').eq(username)
        )
        username = response['Items'][0]['username']
        password = response['Items'][0]['password']
        if username is None:
            error = 'Incorrect username.'
        elif not check_password_hash(password):
            error = 'Incorrect password.'
        
        if error is None:
            session.clear()
            session['user_id'] = response['Items'][0]['id']
            return redirect(url_for('index'))

        flash(error)

    return render_template('auth/login.html')

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        table = boto3.resource('dynamodb').Table('users')
        response = table.get_item(
            Key={
                'id': user_id
            }
        )
        g.user = response['Item'][0]['id']

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view