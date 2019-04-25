from sklearn.metrics import accuracy_score
import pandas as pd
import csv
import sklearn
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
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

def clean_input(filename):
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
            print(seperated[7], seperated[8], end = '->')
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


if __name__ == "__main__":
    clean_input('NewsHashed_ORIGINAL.csv')