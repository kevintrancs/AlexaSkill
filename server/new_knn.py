from __future__ import print_function
from sklearn.metrics import accuracy_score
import pandas as pd
import csv
import sklearn
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import scipy
import numpy as np
import os
import json
import time

PROVIDER_FILE = "provider_map.txt"
CATEGORY_FILE = "category_map.txt"

def get_json_dict(infile):
    json_str = None
    if os.path.isfile(infile):
        print("GOT ONE BABY!")
        json_str = open(infile, 'r').read()
    return json_str

def write_json_dict(dict_input, outfile):
    json_str = json.dumps(dict_input)
    with open(outfile, 'w') as json_out:
        json_out.write(json_str)

def clean_input_csv(filename):
    print("dealing with", filename)
    # Initialize to empty
    provider_dict = {}
    category_dict = {}
    # See if we have the files already made. If we do, load them up and replace empties
    provider_str = get_json_dict(PROVIDER_FILE)
    category_str = get_json_dict(CATEGORY_FILE)
    if provider_str != None:
        provider_dict = json.loads(provider_str)
        assert type(provider_dict) == dict
    if category_str != None:
        category_str = json.loads(category_str)
        assert type(category_dict) == dict

    # Similar to readData file, but replaces each provider/category with the appropriate number
    # associated with it. If we've seen this cat/prov before, replace it with the correct number.
    # If we haven't, just assign it the next number in the dictionary. Write back out to file.
    with open(filename, 'r', encoding='utf8') as infile:
        read = csv.reader(infile, delimiter=',')
        out = ''
        out += str(next(read))
        # For each row,
        for row in read:
            seperated = [str(i) for i in list(row)]
            # Print check
            print(seperated[7], seperated[8], end='->')
            # If we haven't seen this cat before, and it isn't mapped, give it a new slot
            if seperated[7] not in category_dict and seperated[7] not in list(category_dict.values()):
                category_dict[seperated[7]] = len(category_dict)
            # If we have a slot for this cat, replace (could be newly mapped or reencountered on first run)
            if seperated[7] in category_dict:
                seperated[7] = category_dict[seperated[7]]
            # Same as categories but for providers
            if seperated[8] not in provider_dict and seperated[8] not in list(provider_dict.values()):
                provider_dict[seperated[8]] = len(provider_dict)
            if seperated[8] in provider_dict:
                seperated[8] = str(provider_dict[seperated[8]])
            print(seperated[7], seperated[8])
            # Writing back out to CSV
            out += ','.join([str(i) for i in seperated])
            out += '\n'
        infile.close()
        dot_pos = filename.rfind('.')
        with open(filename[:dot_pos] + "_CLEAN" + filename[dot_pos:], 'w', encoding='utf8') as outfile:
            outfile.write(out)
    # Once we're done creating our dictionaries, write them back out to files
    write_json_dict(provider_dict, PROVIDER_FILE)
    write_json_dict(category_dict, CATEGORY_FILE)


def read_file_csv(filename):
    id = []
    category = []
    provider = []
    dot_pos = filename.rfind('.')
    with open(filename[:dot_pos] + "_CLEAN" + filename[dot_pos:], 'w', encoding='utf8') as infile:
        read = csv.reader(infile, delimiter=',')
        for row in read:
            seperated = list(row)
            id.append(seperated[0])
            category.append(seperated[7])
            provider.append(seperated[8])
        
    catmap = list(map(int, category))
    provmap = list(map(int, provider))
    x_points = [list(i) for i in zip(catmap, provmap)]


def clean_list_catprov(inlist, n):
    # Initialize to empty
    provider_dict = {}
    category_dict = {}
    # See if we have the files already made. If we do, load them up and replace empties
    provider_str = get_json_dict(PROVIDER_FILE)
    category_str = get_json_dict(CATEGORY_FILE)
    if provider_str != None:
        provider_dict = json.loads(provider_str)
        #print(len(provider_dict))
        assert type(provider_dict) == dict
    if category_str != None:
        #print(category_str)
        category_dict = json.loads(category_str)
        #print(category_dict)
        assert type(category_dict) == dict
    
    outlist = []

    for each in inlist:
        if each[1] not in category_dict and each[1] not in list(category_dict.values()):
            category_dict[each[1]] = len(category_dict)
        # If we have a slot for this cat, replace (could be newly mapped or reencountered on first run)
        if each[1] in category_dict:
            each[1] = category_dict[each[1]]*n
        # Same as categories but for providers
        if each[2] not in provider_dict and each[2] not in list(provider_dict.values()):
            provider_dict[each[2]] = len(provider_dict)
        if each[2] in provider_dict:
            each[2] = provider_dict[each[2]]
        outlist.append(each)
    #print(outlist)

    write_json_dict(provider_dict, PROVIDER_FILE)
    write_json_dict(category_dict, CATEGORY_FILE)
    return outlist

def clean_interaction_data(user_data):
    for each in user_data:
        interactions = each[-1]
        summed = 0
        for i in range(len(interactions)):
            if interactions[-i-1] == 1:
                summed += 2**i
        each[-1] = summed
    return user_data

def split_data(user_data, news_data):
    user_ids = [i[0] for i in user_data]
    user_points = [[i[1], i[2]] for i in user_data]
    outcomes = [i[3] for i in user_data]
    news_ids = [i[0] for i in news_data]
    news_points = [[i[1], i[2]] for i in news_data]
    return user_ids, user_points, outcomes, news_ids, news_points
    


def knn(xtrain, ytrain, xtest):
    for i in range(len(xtrain)):
        print(xtrain[i], '->', ytrain[i])
    knn = KNeighborsClassifier(n_neighbors = 5)
    knn.fit(xtrain, ytrain)
    predictions = knn.predict(xtest)
    print(len(predictions))
    print(predictions)
    return predictions

def rfc(xtrain, ytrain, xtest):
    #for i in range(len(xtrain)):
        #print(xtrain[i], '->', ytrain[i])
    clf = RandomForestClassifier( criterion="entropy")
    clf.fit(xtrain, ytrain)
    print(clf.feature_importances_)
    predictions = clf.predict(xtest)
    #print(len(predictions))
    #print(predictions)
    return predictions

# MODE SHOULD BE "CSV" or other
def main(user_data, news_in, input, mode):
    if input == "CSV":
        x = 1
        # do nothing for now
    else:
        if mode == "RFC":
            news_catprov = clean_list_catprov(news_in, 1)
            user_catprov = clean_list_catprov(user_data, 1)
            user_catprov_binary = clean_interaction_data(user_catprov)
            user_ids, user_points, user_outcomes, news_ids, news_points = split_data(user_catprov_binary, news_catprov)
            predictions = rfc(user_points, user_outcomes, news_points)
            zipped = zip(news_ids, predictions)
            #print(zipped, type(zipped))
            # This line right here is why I hate python 2
            results = list(reversed(sorted(zipped, key = lambda t: t[1])))
            #print(results, type(results))
            return results
        else:
            news_catprov = clean_list_catprov(news_in, 1)
            user_catprov = clean_list_catprov(user_data, 1)
            user_catprov_binary = clean_interaction_data(user_catprov)
            user_ids, user_points, user_outcomes, news_ids, news_points = split_data(user_catprov_binary, news_catprov)
            predictions = knn(user_points, user_outcomes, news_points)
            zipped = zip(news_ids, predictions)
            #print(zipped, type(zipped))
            # This line right here is why I hate python 2
            results = list(reversed(sorted(zipped, key = lambda t: t[1])))
            #print(results, type(results))
            return results
