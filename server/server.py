# Just sample grabbing sysnet ids nothing too sick...
# Not quite the best idea should fix Path but its okay
import sys
sys.path.append("..")
import boto3
from boto3.dynamodb.conditions import Key, Attr
from flask_cors import CORS
#from flask.logging import default_handler
from flask import request
from flask import json
from bs4 import BeautifulSoup
from flask import Flask, Response
import requests
import json
import operator
import os
import datetime
import uuid
from data.news import headers, pull
from warrant import Cognito
from jose import jwt, jwk
from ast import literal_eval
app = Flask(__name__)
CORS(app)

with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

boto3.setup_default_session(profile_name="clevernews")
db = boto3.resource('dynamodb', aws_access_key_id=CONSTANTS['aws_access_key_id'],
    aws_secret_access_key=CONSTANTS['aws_secret_key_id'], region_name=CONSTANTS['aws_region_name'])
table = db.Table('NewsHashed')
users_table = db.Table('userData')
events_table = db.Table('events')

def get_syset_info(ids):
    terms = set()
    j = None
    for i in ids:
        r = requests.get(
            "https://babelnet.io/v5/getSynset?id={}&pos=NOUN&key={}".format(i, CONSTANTS['babel_key']))
        j = r.json()
        for i in j['senses']:
            for k, v in i['properties'].items():
                if k == 'simpleLemma':
                    terms.add(v)
    print(terms)


def get_sysets_id(term):
    ids = []
    r = requests.get(
        " https://babelnet.io/v5/getSynsetIds?lemma={}&searchLang=EN&pos=NOUN&key={}".format(term, CONSTANTS['babel_key']))
    for i in r.json():
        ids.append(i['id'])
    return ids


@app.route("/api/category", methods=['GET'])
def fetch_category():
    # GET: Returns JSON of categories
    # Returns Array of all the ones found.
    cat_name = request.args.get('field')

    if cat_name in ["Breaking", "History", "Settings", "Trending"]:
        cat_name = "Other"
    if cat_name:
        response = table.scan(FilterExpression=Attr('category').eq(cat_name))
    else:
        return Response(json.dumps({'found': []}), status=204, mimetype='application/json')

    if response['Count'] > 0:
        clean(response['Items'])
        return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'found': []}), status=204, mimetype='application/json')

@app.route("/api/ml", methods=['GET'])
def fetch_related():
    id = request.args.get('field')
    #id = '0419d45c92fb9a205d63a7c5177cea3bce8e89f9244ae0d61eab143af0c294ad'
    if id:
        response = table.get_item(Key={'id': id})
        print(response)
    
    else:
        return Response(json.dumps({'found': []}), status=204, mimetype='application/json')
    
    if response['Item']['related_ids']:
        related_ids = response['Item']['related_ids']
        #print(related_ids)
        article_data = []
        for rel in related_ids:
            resp = table.get_item(Key={'id': rel})
            if resp['Item']:
                article_data.append(resp['Item'])
        #print(article_data[:3])
        #print(len(article_data))
        return Response(json.dumps({'found': article_data}), status=200, mimetype='application/json')
    else:
       return Response(json.dumps({'found': []}), status=204, mimetype='application/json')

@app.route("/api/inital", methods=['GET'])
def fetch_initial():
    # GET: Returns JSON of categories
    # Returns Array of all the ones found.
    cat_name = request.args.get('field')
    cat_name2 = request.args.get('field2')
    cat_name3 = request.args.get('field3')

    if cat_name:
        response = table.scan(FilterExpression=Attr('category').eq(cat_name) & Attr(
            'category').eq(cat_name2) & Attr('category').eq(cat_name3))
    else:
        return Response(json.dumps({'found': []}), status=204, mimetype='application/json')

    if response['Count'] > 0:
        return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'found': []}), status=204, mimetype='application/json')


@app.route("/api/search", methods=['GET'])
def fetch_custom():
    # GET: Returns json of custom query serch
    # Returns Array of all the ones found.
    # If we miss AWS search we will hit BING api search and cache the data
    search_query = request.args.get('field')
    if search_query:
        response = table.scan(FilterExpression=Attr(
            'query_use').contains(search_query))
    else:
        return Response(json.dumps({'found': []}), status=204, mimetype='application/json')

    if response['Count'] > 0:
        clean(response['Items'])
        return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
    else:
        response = table.scan(FilterExpression=Attr(
            'name').contains(search_query))
        if response['Count'] > 0:
            return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
        else:
            pull(search_query)
            response = table.scan(FilterExpression=Attr(
                'query_use').eq(search_query))
            return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')


def clean(json):
    json.sort(key=operator.itemgetter('datePublished'), reverse=True)


@app.route("/user/login", methods=['POST'])
def login_user():
    data = request.data
    dataDict = json.loads(data)
    _email = dataDict.get('email')
    _password = dataDict.get('password')
    u = Cognito(CONSTANTS['cognito_id'], CONSTANTS['cognito_app'],
                username=_email)
    u.authenticate(password=_password)
    info = {
        "id_token": u.id_token,
        "access_token": u.access_token,
        "refresh_token": u.refresh_token
    }
    return Response(json.dumps(info), status=200, mimetype='application/json')


def verify_user(access, refresh, id):
    u = Cognito(CONSTANTS['cognito_id'], CONSTANTS['cognito_app'],
                id_token=id, refresh_token=refresh, access_token=access)
    if (not u.check_token() is None):
        id_info = jwt.get_unverified_claims(id)
        access_info = jwt.get_unverified_claims(access)
        if id_info.get('sub') == access_info.get('username') and access_info.get('client_id') == CONSTANTS['cognito_app']:
            print(id_info.get('email'))
            return True, id_info.get('email')
        else:
            return False, None
    return False, None


@app.route("/user/logout", methods=['GET'])
def logout_user():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')

    u = Cognito(CONSTANTS['cognito_id'], CONSTANTS['cognito_app'],
                id_token=_id, refresh_token=refresh, access_token=access)
    u.logout()
    return Response(json.dumps({"status": True}), status=200, mimetype='application/json')


@app.route("/user/register", methods=['POST'])
def register_user():
    data = request.data
    dataDict = json.loads(data)
    _email = dataDict.get('email')
    _password = dataDict.get('password')
    u = Cognito(CONSTANTS['cognito_id'], CONSTANTS['cognito_app'])
    u.add_base_attributes(email=_email)
    u.register(_email, _password)
    try:
        user = {'userId': _email, 'history': [], 'bookmarks': [],
                'ml_one': " ", 'ml_two': " ", 'ml_three': " "}
        users_table.put_item(Item=user)
    except:  # if there is any error
        pass

    return Response(json.dumps({"status": "Successful Register"}), status=200, mimetype='application/json')


@app.route("/user/addEvent", methods=['PUT'])
def add_user_event():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    data = request.data
    dataDict = json.loads(data)
    event = dataDict.get('event_dict')
    print(event)
    #valid, email = verify_user(access, refresh, _id)
    _id = 'None'
    try:
        event = {'id': str(uuid.uuid4()), 'time': str(datetime.datetime.now()), 'user_id': str(_id), 
                'article': str(event['article']), 'category': str(event['category']), 'favorited': str(event['favorited']),
                'liked': str(event['liked']), 'disliked': str(event['disliked']), 'clicked': str(event['clicked'])}
        response = events_table.put_item(Item=event)
    except:
        print("Error putting data into events table")

    return Response(json.dumps({"status": "Successful event store"}), status=200, mimetype='application/json')


@app.route("/user/updateBookmark", methods=['PUT'])
def update_history():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    data = request.data
    dataDict = json.loads(data)
    article_id = dataDict.get('article_id')
    valid, email = verify_user(access, refresh, _id)
    if valid:
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="SET bookmarks = list_append(bookmarks, :i)",
            ExpressionAttributeValues={
                ':i': [article_id],
            },
            ReturnValues="UPDATED_NEW"
        )

    return Response(json.dumps({"status": response}), status=200, mimetype='application/json')

@app.route("/user/bookmarks", methods=['GET'])
def get_user_bookmarks():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    valid, email = verify_user(access, refresh, _id)
    bookmarks = None
    bookmarks_feed = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        bookmarks = response['Item']['bookmarks']
        for i in bookmarks:
            response = table.get_item(
                Key={'id': i}
            )
            bookmarks_feed.append(response['Item'])
        clean(bookmarks_feed)
    return Response(json.dumps({"found": bookmarks_feed}), status=200, mimetype='application/json')


if __name__ == "__main__":
    #fetch_related()
    # 0.0.0.0 cause public and shit
    app.run(host='0.0.0.0', debug=True)
    
    # get_syset_info(get_sysets_id('elon musk')
