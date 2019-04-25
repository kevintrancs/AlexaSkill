# Just sample grabbing sysnet ids nothing too sick...
# Not quite the best idea should fix Path but its okay
from __future__ import print_function
import sys
sys.path.append("..")
import boto3
from boto3.dynamodb.conditions import Key, Attr
from flask_cors import CORS
#from flask.logging import default_handler
from flask import request
from flask import json
from bs4 import BeautifulSoup
from flask import Flask, Response, session, make_response, escape
import requests
import json
import operator
import os
from data.news import headers, pull
from warrant import Cognito
from jose import jwt, jwk
from ast import literal_eval

import new_knn
app = Flask(__name__)

CORS(app)

with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')
users_table = db.Table('userData')
events_table = db.Table('events')
collab_table = db.Table('collab_filter')

cog_client = boto3.client('cognito-idp')

cookie_id = str(uuid.uuid4())
user_id = cookie_id

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
    if id:
        response = table.get_item(Key={'id': id})
    
    else:
        return Response(json.dumps({'found': []}), status=204, mimetype='application/json')
    
    if response['Item']['related_ids']:
        related_ids = response['Item']['related_ids']
        article_data = []
        for rel in related_ids:
            resp = table.get_item(Key={'id': rel})
            if resp['Item']:
                article_data.append(resp['Item'])
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
    source = search_query.split()[0]
    if source == "source:":
        response = table.scan(FilterExpression=Attr(
            'provider').contains(search_query.split()[1]))
        if response['Count'] > 0:
            clean(response['Items'])
            return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
        else:
            return Response(json.dumps({'found': []}), status=204, mimetype='application/json')

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
    u = Cognito(CONSTANTS['cognito_id'], CONSTANTS['cognito_app'], username=_email)
    u.authenticate(password=_password)
    info = {
        "id_token": u.id_token,
        "access_token": u.access_token,
        "refresh_token": u.refresh_token
    }
    return Response(json.dumps(info), status=200, mimetype='application/json')

def verify_user(access, refresh, id):
    try:
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
    except Exception as e:
        print(e)
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
                'ml_one': " ", 'ml_two': {}, 'ml_three': " "}
        users_table.put_item(Item=user)
    except:  # if there is any error
        pass

    return Response(json.dumps({"status": "Successful Register"}), status=200, mimetype='application/json')


## ****************************** ##

### ALRIGHT LADIES AND GENTLEMEN BIG ASTERISK ON THIS SECTION HERE
### FLAGS FOR INTERACTION IN ML_TWO ARE IN THE ORDER AS FOLLOWS
### [ LIKE, BOOKMARK, CLICK, DISLIKE ]
### EX: ARTICLE = [1,0,1,1] MEANS LIKED, BOOKMARKED, AND CLICKED

## ****************************** ##


## UPDATE (ADD) METHODS

@app.route("/user/updateBookmark", methods=['PUT'])
def update_bookmarks():
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

        # Here's where we do stuff to ML_TWO.
        # If the article exists, set the bookmarked flag to 1; 
        # if doesn't exist, add article with bookmarked flag set to 1
        user_entry = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = user_entry['Item']['ml_two']
        if article_id in ml_two:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a[1] = :v",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':v': 1,
                },
                ReturnValues="UPDATED_NEW"
            )
        else:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a = :L",
                 ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':L': [0,1,0,0],
                },
                ReturnValues="UPDATED_NEW"
            )
    return Response(json.dumps({"status": response}), status=200, mimetype='application/json')

@app.route("/user/addEvent", methods=['PUT'])
def add_user_event():
    '''
    valid = False
    email = ''
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    data = request.data
    dataDict = json.loads(data)


    event = dataDict.get('event_dict')
    #print(event)
    try:
        valid, email = verify_user(access, refresh, _id)

    except Exception as e:
        print(e)
    
    finally:
        
        if 'user_id' not in session:
            if email != '' and email != None:
                session['user_id'] = email
            else:
                session['user_id'] = cookie_id
            print("user_id not in session uid: ", session['user_id'])
        elif session['user_id'] != email and (email != '' or email != None):
            session['user_id'] = email
            print('not user_id and valid uid: ', session['user_id'])
        elif session['user_id'] != cookie_id:
            session['user_id'] = cookie_id
            print('user_id != cookie_id uid: ', session['uid'])
        else:
            print("Session uid: ", session['user_id'])
            pass

    try:
        event = {'user_id': str(escape(session['user_id'])), 'time': str(datetime.datetime.now()), 
                'article': str(event['article']), 'category': str(event['category']), 'favorited': str(event['favorited']),
                'liked': str(event['liked']), 'disliked': str(event['disliked']), 'clicked': str(event['clicked']),
                'searchVal': str(event['searchVal'])}

        article_visited = {'user_id': str(escape(session['user_id'])), 'time': str(datetime.datetime.now()),
                           article}

        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="SET bookmarks = list_append(bookmarks, :i)",
            ExpressionAttributeValues={
                ':i': [article_id],
            },
            ReturnValues="UPDATED_NEW"
        )
        response = events_table.put_item(Item=event)
        print("event stored")
    except Exception as e:
        print(e)
        print("Error putting data into events table")

    '''
    return Response(json.dumps({"status": "Successful event store"}), status=200, mimetype='application/json')

@app.route("/user/collabFilter", methods=['PUT'])
def collab_filter():
    email = 'supertest1@test.com'
    '''
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    valid, email = verify_user(access, refresh, _id)

    data = request.data
    dataDict = json.loads(data)
    article_id = dataDict.get('article_id')
    '''
    valid = True
    usersWhoRead = {}
    if valid:
        response = collab_table.query(
            KeyConditionExpression=Key('user_id').eq(email)
        )
        for i in response['Items']:
            for item in i['articles_read']:
                response2 = collab_table.scan(
                    FilterExpression=Attr('articles_read').contains(item) & Attr('user_id').ne(email)
                )
                #print(response2)
                if response2['Items'] != []:
                    result = response2['Items'][0]['articles_read']
                    alsoRead = []
                    for article in result:
                        if article not in alsoRead and article != item:
                            alsoRead.append(article)
                    usersWhoRead[item] = alsoRead

    print(usersWhoRead)
    article_data = []
    for k, v in usersWhoRead.items():
        resp = table.get_item(Key={'id': rel})
        if 'Item' in resp:
            article_data.append(resp['Item'])
    #print(article_data[:3])
    #print(len(article_data))
    return Response(json.dumps({'found': article_data}), status=200, mimetype='application/json')



    #return Response(json.dumps({"status": "Successful collab event"}), status=200, mimetype='application/json')


@app.route("/user/readArticle", methods=['PUT'])
def read_article():
    user_id = ''

    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    valid, email = verify_user(access, refresh, _id)
    
    try:
        if valid:
            resp = cog_client.initiate_auth(
                AuthFlow='REFRESH_TOKEN',
                AuthParameters={
                    'REFRESH_TOKEN': refresh
                },
                ClientId=CONSTANTS['cognito_app']
            )
    
    except Exception as e:
        print(e)

    if valid:
        user_id = email
    else:
        user_id = cookie_id

    data = request.data
    dataDict = json.loads(data)
    article_id = dataDict.get('article_id')
    article_id = article_id['article_id']
    print(article_id)

    try:

        if valid:
            cog_client.admin_get_user(
                UserPoolId='us-east-1_fRRMhtU84',
                Username=user_id      
            )
            
        response = collab_table.update_item (
            Key={'user_id': user_id},
            UpdateExpression="SET articles_read = list_append(articles_read, :i)",
            ExpressionAttributeValues={
                ':i': [article_id],
            },
            ReturnValues="UPDATED_NEW"
        )   
    except Exception as e:
        print(e)
        try:
            response = collab_table.put_item(
                Item={
                    'user_id': user_id,
                    'articles_read': [article_id]
                }
            )
        except Exception as e:
            print(e)
    
    return Response(json.dumps({"status": "Successful collab event"}), status=200, mimetype='application/json')

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

        user_entry = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = user_entry['Item']['ml_two']
        if article_id in ml_two:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a[2] = :v",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':v': 1,
                },
                ReturnValues="UPDATED_NEW"
            )
        else:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a = :L",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':L': [0,0,1,0],
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

        user_entry = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = user_entry['Item']['ml_two']
        if article_id in ml_two:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a[0] = :v",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':v': 1,
                },
                ReturnValues="UPDATED_NEW"
            )
        else:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a = :L",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':L': [1,0,0,0],
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

        user_entry = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = user_entry['Item']['ml_two']
        if article_id in ml_two:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a[3] = :v",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':v': 1,
                },
                ReturnValues="UPDATED_NEW"
            )
        else:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a = :L",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':L': [0,0,0,1],
                },
                ReturnValues="UPDATED_NEW"
            )
    return Response(json.dumps({"status": response}), status=200, mimetype='application/json')



## REMOVE METHODS

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
        remove_index = int(bookmarks.index(article_id))
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="REMOVE bookmarks["+str(remove_index)+"]",
            ReturnValues="ALL_NEW"
        )
        user_entry = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = user_entry['Item']['ml_two']
        if article_id in ml_two:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a[1] = :v",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':v': 0,
                },
                ReturnValues="UPDATED_NEW"
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
        remove_index = int(likes.index(article_id))
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="REMOVE likes["+str(remove_index)+"]",
            ReturnValues="ALL_NEW"
        )
        user_entry = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = user_entry['Item']['ml_two']
        if article_id in ml_two:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a[0] = :v",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':v': 0,
                },
                ReturnValues="UPDATED_NEW"
            )
        del likes[remove_index]
        for i in likes:
            response = table.get_item(
                Key={'id': i}
            )
            likes_list.append(response['Item'])
        clean(likes_list)
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
        remove_index = int(dislikes.index(article_id))
        response = users_table.update_item(
            Key={'userId': email},
            UpdateExpression="REMOVE dislikes["+str(remove_index)+"]",
            ReturnValues="ALL_NEW"
        )
        user_entry = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = user_entry['Item']['ml_two']
        if article_id in ml_two:
            response_two = users_table.update_item(
                Key = {'userId': email},
                UpdateExpression="SET ml_two.#a[3] = :v",
                ExpressionAttributeNames={
                    '#a': str(article_id),
                },
                ExpressionAttributeValues={
                    ':v': 0,
                },
                ReturnValues="UPDATED_NEW"
            )
        del dislikes[remove_index]
        for i in dislikes:
            response = table.get_item(
                Key={'id': i}
            )
            dislikes_list.append(response['Item'])
        clean(dislikes_list)
    return Response(json.dumps({"found": dislikes_list}), status=200, mimetype='application/json')



## GET METHODS

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
    # get_ml_two(access, refresh, _id)
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

def fetch_mini():
    # Explicit trendingtopics thing. Literally the only difference
    search_query = "trendingtopics"
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

@app.route("/user/mltwo", methods=['GET'])
def get_ml_two():
    access = request.headers.get('access_token')
    refresh = request.headers.get('refresh_token')
    _id = request.headers.get('id_token')
    valid, email = verify_user(access, refresh, _id)
    
    ml_two_ids = None
    ml_two_feed = []
    # Get user bookmark list
    # search for those ids in
    if valid:
        response = users_table.get_item(
            Key={'userId': email}
        )
        ml_two = response['Item']['ml_two']
        for each in ml_two:
            ml_two[each] = [int(i) for i in ml_two[each]]
        ml_two = json.loads(json.dumps(ml_two))

        real_data = []
        for i in ml_two:
            response = table.get_item(
                Key={'id': i}
            )
            real_data.append([i, response['Item']['category'], response['Item']['provider'], ml_two[i]])


        all_news = table.scan()
        all_news = all_news['Items']
        all_news.sort(key=operator.itemgetter('datePublished'), reverse=True)
        all_news = all_news[:3000]
        news_condensed = []
        for each in all_news:
            news_condensed.append([each['id'], each['category'], each['provider']])

        results = new_knn.main(real_data, news_condensed, "JSON", "RFC")[:50]
        result_list = []
        for item in results:
            response = table.get_item(
                Key={'id': item[0]}
            )
            ml_two_feed.append(response['Item'])
    return Response(json.dumps({"found": ml_two_feed}), status=200, mimetype='application/json')



if __name__ == "__main__":
    # 0.0.0.0 cause public and shit
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

    app.run(host='0.0.0.0', debug=True)
    
