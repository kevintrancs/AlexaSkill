# News article Pipelines

import json
import requests
import boto3
from boto3.dynamodb.conditions import Key
import logging
import time
import hashlib

# Default configs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

headers = {"Ocp-Apim-Subscription-Key": CONSTANTS['azure_key']}
db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')


def generate_hashed_id(secret):
    """
    Generates and returns the SHA-256 hash of the string needed
    """
    sha256_obj = hashlib.sha256(secret)
    return sha256_obj.hexdigest()


def get_keyword(term):
    """
    Searches the Azure Bing News API v7 based on a given keyboard
    ----------
    Returns
    list of articles as a dictionary
    """
    search_url = CONSTANTS['azure_endpoint']
    params = {"q": term, "textDecorations": False,
              "textFormat": "HTML", "count": 100}
    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    data = []
    queried = term if len(term) > 0 else "topnews"
    for article in search_results["value"]:
        d = {}
        d['id'] = None
        d['url'] = article['url'] if 'url' in article else " "
        d['description'] = article['description'] if 'description' in article else " "
        d['provider'] = article['provider'][0]['name'] if 'provider' in article else " "
        d['category'] = article['category'] if 'category' in article else "Other"
        d['datePublished'] = article['datePublished'] if 'datePublished' in article else " "
        d['name'] = article['name'] if 'name' in article else " "
        d['mentions'] = article['mentions'] if 'mentions' in article else " "
        d['thumbnail'] = article['image']['thumbnail']['contentUrl'] if 'image' in article else " "
        d['query_use'] = queried
        data.append(d)
    return data


def pull(q):
    """
    Pulls in from our query
    """
    data = get_keyword(q)
    cache_articles(data)


def exists(hash_key):
    """
    Checks if the article already exists in our database
    """
    try:
        item = table.get_item(id=hash_key)
    except:  # if there is any error
        item = None
    return item


def cache_articles(res):
    """
    Caches the articles found from a search into DynamoDB
    """
    for article in res:
        hashed_id = generate_hashed_id(article['name'].encode('utf-8'))
        if exists(hashed_id) is None:  # doesn't exist yet
            article['id'] = hashed_id
            table.put_item(Item=article)


if __name__ == "__main__":
    start = time.time()
    logger.info("--------- Script starting ---------")
    logger.info("--------- Pulling top news for today ---------")
    pull("")
    logger.info("--------- Pulling trending topics ---------")
    pull("trendingtopics")
    logger.info("--------- Pulling Business topics ---------")
    pull("Business")
    logger.info("--------- Pulling Sports topics ---------")
    pull("Sports")
    logger.info("--------- Pulling Entertainment topics ---------")
    pull("Entertainment")
    logger.info("--------- Pulling World topics ---------")
    pull("World")
    logger.info("--------- Pulling US topics ---------")
    pull("US")
    logger.info(
        "--------- Script finished took {} seconds ---------".format(round((time.time()-start) % 60, 2)))
