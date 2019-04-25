import pandas as pd 
import numpy as np 
import nltk
import boto3
import json
#nltk.download('punkt')
#nltk.download('stopwords')
#nltk.download('wordnet')
import re
from nltk.corpus import stopwords 
import math
from ast import literal_eval

with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

db = boto3.resource('dynamodb', aws_access_key_id=CONSTANTS['aws_access_key_id'],
    aws_secret_access_key=CONSTANTS['aws_secret_key_id'], region_name='us-east-1')
table = db.Table('NewsHashed')

stopwords = nltk.corpus.stopwords.words('english')


#######################################################################
# http://kavita-ganesan.com/extracting-keywords-from-text-tfidf/#.XGn8fYWIZCY
#######################################################################
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer

def pre_process(text):
    
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

######################################################################################
# This section works with data pulled from scan of DynamoDB table
# A dataframe is created out of NewsHashed table, keywords are found using 
# article title and description, then a new keywords column is added to dataframe
# that stores a list of the keywords per article


# function that takes in the NewsHashed dataframe, finds keywords using TF-IDF,
# then returns a new dataframe with keywords column
def makeKeywordColumn(dataframe):
    df = dataframe
    stopwords = nltk.corpus.stopwords.words('english')

    df['text'] = df['name'] + ' ' + df['description']
    df['text'] = df['text'].apply(lambda x:pre_process(x))

    docs = df['text'].tolist()

    cv = CountVectorizer(max_df=0.85, stop_words=stopwords)
    word_count_vector = cv.fit_transform(docs)

    tfidf_transformer = TfidfTransformer(smooth_idf=True,use_idf=True)
    tfidf_transformer.fit(word_count_vector)

    feature_names = cv.get_feature_names()

    doc = docs[2]
    tf_idf_vector = tfidf_transformer.transform(cv.transform([doc]))
    sorted_items = sort_coo(tf_idf_vector.tocoo())
    doc3_keywords = extract_topn_from_vector(feature_names,sorted_items,10)

    df['keywords'] = np.empty((len(df), 0)).tolist()

    print(len(docs))

    keyword_dict = {}
    for i in range(len(docs)):
        tf_idf_vector = tfidf_transformer.transform(cv.transform([docs[i]]))
        sorted_items = sort_coo(tf_idf_vector.tocoo())
        kws = extract_topn_from_vector(feature_names,sorted_items,10)
        keyword_dict[i] = kws
        kw_list = []
        for k in kws:
            kw_list.append(k)
        try:
            df.at[i, 'keywords'] = kw_list
        except Exception as e:
            print(e)
            # try:
            #     df.at[i, 'keywords'] = kw_list
            # except Exception as e1:
            #     print(e1)

    df.drop(columns=['text'], inplace=True)

    return df


##################################################
# this gets items from NewsHashed table, turns it into
# dataframe, which then gets passed to makeKeywordsColumn
# function to make keywords column, which then gets used later
# to make related articles column

'''
response = table.scan(Limit=200)
df_dict = {}

for k,v in enumerate(response['Items']):
    index = str(k)
    df_dict[index] = v
print(df_dict)

df = pd.DataFrame.from_dict(df_dict, orient='index')
df = makeKeywordColumn(df)

cols = df.columns.tolist()

new_dict = df.set_index('id').T.to_dict('list')
new_dict = pd.Series(df.keywords.values,index=df.id).to_dict()
'''


#df_idf.to_csv('keywordsNewsHashed.csv', sep=',', index=False)

##########################################################################################
# This section gets the NewsHashed csv, does the dataframe and keyword column stuff,
# then makes a new csv file with the keyword column added in

'''
df_idf = pd.read_csv('./NewsHashed.csv', sep=',')
df_idf = makeKeywordColumn(df_idf)
df_idf.to_csv('keywordsNewsHashed.csv', sep=',', index=False)
'''


###########################################
# This section reads in the dataframe containing a keywords
# column, loops throught all the rows per article, and finds
# articles that contain the same keyword and stores the related 
# articles in a list. The resulting dictionary can then 
# be used too update items in the DynamoDB table

'''
df_u = pd.read_csv('./updatedNewsHashed.csv',sep=',')
df_u = df_u[:100]

related = {}
ids = []
is_related = False
#print(new_dict)
for k in new_dict:
    ids = []
    is_related = False
    for row in df_u.itertuples():
        for word in literal_eval(row.keywords):
            if word in new_dict[k]:
                if (len(ids) < 10):
                    ids.append(row.id)
                is_related = True
                break
    if is_related == True:
        related[k] = ids
print(related)
'''

'''
for k in related:
    resp = table.update_item(
        Key={
            'id': k 
        },
        UpdateExpression="set related_ids = :ids",
        ExpressionAttributeValues={
            ':ids': related[k]
        },
        ReturnValues="UPDATED_NEW"
    )
print("UpdatedItem successful")
###################################################################################
'''
'''
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
'''

#print("UpdatedItem succeeded:")
#print(json.dumps(response,index=4,cls=DecimalEncoder))
