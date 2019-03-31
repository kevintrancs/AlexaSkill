# Just sample grabbing sysnet ids nothing too sick...
# Not quite the best idea should fix Path but its okay
from __future__ import print_function
import sys
sys.path.append("..")
import boto3
from boto3.dynamodb.conditions import Key, Attr
from flask_cors import CORS
from flask.logging import default_handler
from flask import request
from flask import json
from bs4 import BeautifulSoup
from flask import Flask, Response
import requests
import json
import operator
import os
from data.news import headers, pull
from warrant import Cognito
from jose import jwt, jwk
app = Flask(__name__)
CORS(app)
db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')
users_table = db.Table('userData')
with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

<<<<<<< Updated upstream
=======
db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')
users_table = db.Table('userData')
>>>>>>> Stashed changes

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
    #print(_email, _password, file=sys.stderr)
    u = Cognito(CONSTANTS['cognito_id'], CONSTANTS['cognito_app'], username=_email)
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
        user = {'userId': _email, 'history': [], 'bookmarks': [], "likes": [], "dislikes": [],
                'ml_one': " ", 'ml_two': " ", 'ml_three': " "}
        users_table.put_item(Item=user)
    except:  # if there is any error
        pass

    return Response(json.dumps({"status": "Successful Register"}), status=200, mimetype='application/json')


@app.route("/user/updateBookmark", methods=['PUT'])
def update_bookmarks():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    data = request.data
    dataDict = json.loads(data)
    article_id = dataDict.get('article_id')
    valid, email = verify_user(access, refresh, _id)
    if valid:
        # ConditionExpression: Only add if it's not in there (otherwise 500's)
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="SET bookmarks = list_append(bookmarks, :i)",
            ConditionExpression="NOT(contains(bookmarks, :j))",
            ExpressionAttributeValues={
                ':i': [article_id],
                ':j': article_id,
            },
            ReturnValues="UPDATED_NEW"
        )
    return Response(json.dumps({"status": response}), status=200, mimetype='application/json')

@app.route("/user/updateHistory", methods=['PUT'])
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
            UpdateExpression="SET history = list_append(history, :i)",
            ConditionExpression="NOT(contains(history, :j))",
            ExpressionAttributeValues={
                ':i': [article_id],
                ':j': article_id,
            },
            ReturnValues="UPDATED_NEW"
        )
    return Response(json.dumps({"status": response}), status=200, mimetype='application/json')

@app.route("/user/updateLikes", methods=['PUT'])
def update_likes():
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
            UpdateExpression="SET likes = list_append(likes, :i)",
            ConditionExpression="NOT(contains(likes, :j))",
            ExpressionAttributeValues={
                ':i': [article_id],
                ':j': article_id,
            },
            ReturnValues="UPDATED_NEW"
        )
    return Response(json.dumps({"status": response}), status=200, mimetype='application/json')

@app.route("/user/updateDislikes", methods=['PUT'])
def update_dislikes():
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
            UpdateExpression="SET dislikes = list_append(dislikes, :i)",
            ConditionExpression="NOT(contains(dislikes, :j))",
            ExpressionAttributeValues={
                ':i': [article_id],
                ':j': article_id,
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


@app.route("/user/removeBookmark", methods=["PUT"])
def remove_bookmark():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    data = request.data
    dataDict = json.loads(data)
    article_id = dataDict.get('article_id')
    valid, email = verify_user(access, refresh, _id)
    bookmarks = None
    bookmarks_list = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        bookmarks = response['Item']['bookmarks']
        print(bookmarks, file=sys.stderr)
        remove_index = int(bookmarks.index(article_id))
        print(remove_index, file=sys.stderr)
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="REMOVE bookmarks["+str(remove_index)+"]",
            ReturnValues="ALL_NEW"
        )
        del bookmarks[remove_index]
        for i in bookmarks:
            response = table.get_item(
                Key={'id': i}
            )
            bookmarks_list.append(response['Item'])
        clean(bookmarks_list)
    return Response(json.dumps({"found": bookmarks_list}), status=200, mimetype='application/json')


@app.route("/user/removeLike", methods=["PUT"])
def remove_like():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    data = request.data
    dataDict = json.loads(data)
    article_id = dataDict.get('article_id')
    valid, email = verify_user(access, refresh, _id)
    likes = None
    likes_list = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        likes = response['Item']['likes']
        print(likes, file=sys.stderr)
        remove_index = int(likes.index(article_id))
        print(remove_index, file=sys.stderr)
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="REMOVE likes["+str(remove_index)+"]",
            ReturnValues="ALL_NEW"
        )
        del likes[remove_index]
        for i in likes:
            response = table.get_item(
                Key={'id': i}
            )
            likes_list.append(response['Item'])
        clean(likes_list)
    print("NEW NUM LIKES:", len(likes_list), file=sys.stderr)
    return Response(json.dumps({"found": likes_list}), status=200, mimetype='application/json')


@app.route("/user/removeDislike", methods=["PUT"])
def remove_dislike():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    data = request.data
    dataDict = json.loads(data)
    article_id = dataDict.get('article_id')
    valid, email = verify_user(access, refresh, _id)
    dislikes = None
    dislikes_list = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        dislikes = response['Item']['dislikes']
        print(dislikes, file=sys.stderr)
        remove_index = int(dislikes.index(article_id))
        print(remove_index, file=sys.stderr)
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="REMOVE dislikes["+str(remove_index)+"]",
            ReturnValues="ALL_NEW"
        )
        del dislikes[remove_index]
        for i in dislikes:
            response = table.get_item(
                Key={'id': i}
            )
            dislikes_list.append(response['Item'])
        clean(dislikes_list)
    return Response(json.dumps({"found": dislikes_list}), status=200, mimetype='application/json')



@app.route("/user/history", methods=['GET'])
def get_user_history():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    valid, email = verify_user(access, refresh, _id)
    history = None
    history_feed = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        history = response['Item']['history']
        for i in history:
            response = table.get_item(
                Key={'id': i}
            )
            history_feed.append(response['Item'])
        clean(history_feed)
    return Response(json.dumps({"found": history_feed}), status=200, mimetype='application/json')

@app.route("/user/likes", methods=['GET'])
def get_user_likes():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    valid, email = verify_user(access, refresh, _id)
    likes = None
    likes_list = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        likes = response['Item']['likes']
        for i in likes:
            response = table.get_item(
                Key={'id': i}
            )
            likes_list.append(response['Item'])
    return Response(json.dumps({"found": likes_list}), status=200, mimetype='application/json')

@app.route("/user/dislikes", methods=['GET'])
def get_user_dislikes():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    valid, email = verify_user(access, refresh, _id)
    dislikes = None
    dislikes_list = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        dislikes = response['Item']['dislikes']
        for i in dislikes:
            response = table.get_item(
                Key={'id': i}
            )
            dislikes_list.append(response['Item'])
    return Response(json.dumps({"found": dislikes_list}), status=200, mimetype='application/json')


if __name__ == "__main__":
    # 0.0.0.0 cause public and shit
    app.run(host='0.0.0.0', debug=True)
    # get_syset_info(get_sysets_id('elon musk')
