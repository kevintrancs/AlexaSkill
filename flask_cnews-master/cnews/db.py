import boto3

import click
from flask import current_app, g
from flask.cli import with_appcontext
from cnews import users_schema

def init_db():
    # connect to dynamodb
    # use boto3.client for exception raising purposes
    dynamodb = boto3.client('dynamodb')

    # create user table if it exists
    # or delete it and create it if it already exists
    try:
        users_schema.create_users(dynamodb)
    except dynamodb.exceptions.ResourceInUseException:
        users_schema.delete_users(dynamodb)
        users_schema.create_users(dynamodb)
        pass

# enter "flask init-db" at command line to initialize db   
@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    app.cli.add_command(init_db_command)