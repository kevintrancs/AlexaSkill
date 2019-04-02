import pandas as pd
import numpy as np
import nltk
import boto3
import json
import re
from nltk.corpus import stopwords
import math
from ast import literal_eval

with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')


response = table.scan()

print(response['LastEvaluatedKey'])
