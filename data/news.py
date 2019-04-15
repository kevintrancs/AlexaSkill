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

headers = {"Ocp-Apim-Subscription-Key": CONSTANTS['azure_endpoint']}
db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')

import pandas as pd 
import numpy as np 
import nltk
nltk.download('punkt')
nltk.download('stopwords')
#nltk.download('wordnet')
import re
from nltk.corpus import stopwords 
#from nltk.tokenize import word_tokenize, sent_tokenize 
#from nltk.stem import WordNetLemmatizer
import math

#lemmatizer = WordNetLemmatizer()
stopwords = nltk.corpus.stopwords.words('english')


#######################################################################
# http://kavita-ganesan.com/extracting-keywords-from-text-tfidf/#.XGn8fYWIZCY
#######################################################################
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer

def pre_process(text):
    
    # lowercase
    text=text.lower()
    
    #remove tags
    text=re.sub("&lt;/?.*?&gt;"," &lt;&gt; ",text)
    
    # remove special characters and digits
    text=re.sub("(\\d|\\W)+"," ",text)
    
    return text

def sort_coo(coo_matrix):
    tuples = zip(coo_matrix.col, coo_matrix.data)
    return sorted(tuples, key=lambda x:(x[1], x[0]), reverse=True)

def extract_topn_from_vector(feature_names, sorted_items, topn=10):
    sorted_items = sorted_items[:topn]
    score_vals = []
    feature_vals = []

    for idx, score in sorted_items:
        score_vals.append(round(score, 3))
        feature_vals.append(feature_names[idx])

    results = {}
    for idx in range(len(feature_vals)):
        results[feature_vals[idx]] = score_vals[idx]

    return results


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

        df = pd.Dataframe(data=d)
        df['text'] = df['name'] + " " + df['description']
        df['text'] = df['text'].apply(lambda x:pre_process(x))
        docs = df['text'].tolist()
        cv = CountVectorizer(max_df=0.85, stop_words=stopwords)
        word_count_vector = cv.fit_transform(docs)
        tfidf_transformer = TfidfTransformer(smooth_idf=True,use_idf=True)
        tfidf_transformer.fit(word_count_vector)

        feature_names = cv.get_feature_names()
        doc = docs[0]
        tf_idf_vector = tfidf_transformer.transform(cv.transform([doc]))
        sorted_items = sort_coo(tf_idf_vector.tocoo())
        doc_keywords = extract_topn_from_vector(feature_names,sorted_items,10)
        kw_list = []
        for k in doc_keywords:
            kw_list.append(k)

        d['keywords'] = kw_list
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
