# Just sample grabbing sysnet ids nothing too sick...

# Not quite the best idea should fix Path but its okay
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
import os
from data.news import headers, pull
from HTMLParser import HTMLParser
unescape = HTMLParser().unescape

app = Flask(__name__)
CORS(app)
db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')


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
        return Response(json.dumps({'found': []}), status=404, mimetype='application/json')
    
    if response['Count'] > 0:
        return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'found': []}), status=404, mimetype='application/json')

@app.route("/api/inital", methods=['GET'])
def fetch_initial():
    # GET: Returns JSON of categories
    # Returns Array of all the ones found.
    cat_name = request.args.get('field')
    cat_name2 = request.args.get('field2')
    cat_name3 = request.args.get('field3')

    if cat_name:
        response = table.scan(FilterExpression=Attr('category').eq(cat_name) & Attr('category').eq(cat_name2) & Attr('category').eq(cat_name3))
    else:
        return Response(json.dumps({'found': []}), status=404, mimetype='application/json')
    
    if response['Count'] > 0:
        return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'found': []}), status=404, mimetype='application/json')

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
        return Response(json.dumps({'found': []}), status=404, mimetype='application/json')

    if response['Count'] > 0:
        return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
    else:
        response = table.scan(FilterExpression=Attr(
            'name').contains(search_query))
        if response['Count'] > 0:
            return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')
        else:
            pull(search_query)
            response = table.scan(FilterExpression=Attr('query_use').eq(search_query))
            return Response(json.dumps({'found': response['Items']}), status=200, mimetype='application/json')


if __name__ == "__main__":
    # 0.0.0.0 cause public and shit
    app.run(host='0.0.0.0', debug=True)
