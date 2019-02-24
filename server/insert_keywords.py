import pandas as pd 
import numpy as np 
import nltk
import boto3
import json
nltk.download('punkt')
nltk.download('stopwords')
#nltk.download('wordnet')
import re
from nltk.corpus import stopwords 
#from nltk.tokenize import word_tokenize, sent_tokenize 
#from nltk.stem import WordNetLemmatizer
import math

with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

db = boto3.resource('dynamodb', aws_access_key_id=CONSTANTS['aws_access_key_id'],
    aws_secret_access_key=CONSTANTS['aws_secret_key_id'])
table = db.Table('NewsHashed')

response = table.scan(Limit=200)
#print(len(response['Items'][0]))
df_dict = {}

for k,v in enumerate(response['Items']):
    index = str(k)
    df_dict[index] = v

#print(response)
#print(df_dict)

#df = pd.DataFrame(data=response['Items'][0], index=[0])
#df = pd.Series(response['Items']).to_frame()
df = pd.DataFrame.from_dict(df_dict, orient='index')
#print(df.head())
#print(df.shape)


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
'''
df_idf = pd.read_csv('../data/NewsHashed.csv',sep=',')
#print("Schema:\n\n", df_idf.dtypes)
#print("Number of questions, columns=", df_idf.shape)


df_idf['text'] = df_idf['name'] + df_idf['description']
df_idf['text'] = df_idf['text'].apply(lambda x:pre_process(x))

#print(df_idf['text'][2])

docs = df_idf['text'].tolist()
cv = CountVectorizer(max_df=0.85,stop_words=stopwords)
word_count_vector = cv.fit_transform(docs)
#print(list(cv.vocabulary_.keys())[:10])

tfidf_transformer = TfidfTransformer(smooth_idf=True,use_idf=True)
tfidf_transformer.fit(word_count_vector)

feature_names = cv.get_feature_names()
doc = docs[3]
tf_idf_vector = tfidf_transformer.transform(cv.transform([doc]))
sorted_items = sort_coo(tf_idf_vector.tocoo())
doc3_keywords = extract_topn_from_vector(feature_names,sorted_items,10)
'''

df['text'] = df['name'] + ' ' + df['description']
df['text'] = df['text'].apply(lambda x:pre_process(x))

docs = df['text'].tolist()
#print(docs)

cv = CountVectorizer(max_df=0.85, stop_words=stopwords)
word_count_vector = cv.fit_transform(docs)

tfidf_transformer = TfidfTransformer(smooth_idf=True,use_idf=True)
tfidf_transformer.fit(word_count_vector)

feature_names = cv.get_feature_names()

doc = docs[2]
tf_idf_vector = tfidf_transformer.transform(cv.transform([doc]))
sorted_items = sort_coo(tf_idf_vector.tocoo())
doc3_keywords = extract_topn_from_vector(feature_names,sorted_items,10)

#for k in doc3_keywords:
 #   print(k, doc3_keywords[k])


df['keywords'] = np.empty((len(df), 0)).tolist()

keyword_dict = {}
for i in range(len(docs)):
    tf_idf_vector = tfidf_transformer.transform(cv.transform([docs[i]]))
    sorted_items = sort_coo(tf_idf_vector.tocoo())
    kws = extract_topn_from_vector(feature_names,sorted_items,10)
    keyword_dict[i] = kws
    kw_list = []
    for k in kws:
        #print(k)
        kw_list.append(k)
    df.at[str(i), 'keywords'] = kw_list

df.drop(columns=['text'], inplace=True)

#print(df.iloc[3]['keywords'])
#print(df.shape)

cols = df.columns.tolist()
#print(cols)

new_dict = df.set_index('id').T.to_dict('list')
new_dict = pd.Series(df.keywords.values,index=df.id).to_dict()
#print(new_dict)

for k in new_dict:
    resp = table.update_item(
        Key={
            'id': k
        },
        UpdateExpression="set keywords = :kw",
        ExpressionAttributeValues={
            ':kw': new_dict[k]
        },
        ReturnValues="UPDATED_NEW"
    )


print("UpdatedItem succeeded:")
#print(json.dumps(response,index=4,cls=DecimalEncoder))
