import json
import requests
from flask import Flask, Response
from bs4 import BeautifulSoup
from flask import json
from flask import request
from flask.logging import default_handler
from flask_cors import CORS
from newsapi import NewsApiClient

app = Flask(__name__)
CORS(app)
with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)
newsapi = NewsApiClient(api_key=CONSTANTS['news_api_key'])


@app.route("/api", methods=['GET'])
def articles():
    field = request.args.get('search')
    res = []
    all_news = newsapi.get_top_headlines(q=str(field))
    for articles in all_news['articles']:
        data = {
            'title': articles['title'],
            'url': articles['url'],
            'content': articles['content'],
            'source': articles['source']['name'],
            'publishedAt': articles['publishedAt']
        }
        res.append(data)
    return Response(json.dumps({'articles': res}), status=200, mimetype='application/json')


if __name__ == "__main__":
    # 0.0.0.0 cause public and shit
    app.run(host='0.0.0.0', port=8080)
