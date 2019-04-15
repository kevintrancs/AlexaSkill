from sklearn.metrics import accuracy_score
import pandas as pd
import csv
import sklearn
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
import scipy
import numpy as np

def readFile():
    id = []
    category = []
    provider = []
    #click = []
    #like = []
    #dislike = []
    #bm = []
    outcome = []


    with open('NewsHashed.csv', encoding='utf8') as csvfile:
        read = csv.reader(csvfile, delimiter=',')
        for row in read:
            seperated_data = (list(row))
            id.append(seperated_data[0])
            category.append(seperated_data[8])
            provider.append(seperated_data[10])
            outcome.append(seperated_data[13]) #possibly change when get all data?

    cat_p = list(map(float, category))
    prov_p = list(map(float, provider))


    #make a list of tuples of the features we will predict on
    predict = list(zip(cat_p, prov_p))
    predict_list = []
    for i in predict:
        element = list(i)
        predict_list.append(element)

    # outcome would be clicked + like or dislike + bookmark
    outcome_type = list(map(int,outcome))

    return id, category, provider, outcome_type, predict_list
    # add click, like, dislike, bookmark

def main():
    data = readFile()

    #making the knn
    neighbors = KNeighborsClassifier(n_neighbors=25)
    y = np.array(data[3]).reshape(-1,1) # originally 7
    X = np.array(data[4]).reshape(-1,2)  # reserved for outcome, might not be in list but was trying it out
    #print(y)

    #splitting the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.25)

    neighbors.fit(X_train, y_train)
    KNeighborsClassifier(...)

    #print(X_test)
    predictions = neighbors.predict(X_test)
    print(len(X))
    print(len(predictions))
    print(predictions)

    for i in predictions: # change to applicable outcome types
        if(i == 0):
            print("ignored")
        elif(i == 1):
            print("clicked but no like/dislike or bookmark")
        elif(i == 2):
            print("clicked and liked, no bookmark")
        elif(i == 3):
            print("clicked and liked with bookmark")
        elif (i == 4):
            print("clicked and disliked, no bookmark")
        elif (i == 5):
            print("clicked and disliked with bookmark")
        elif (i == 6):
            print("clicked, bookmarked, but no like/dislike")
        elif (i == 7):
            print("not clicked, not liked/disliked, bookmarked")
        elif (i == 8):
            print("not clicked, liked, not bookmarked")
        elif (i == 9):
            print("not clicked, liked, bookmarked")
        elif (i == 10):
            print("not clicked, disliked, not bookmarked")
        elif (i== 11):
            print("not clicked, disliked, bookmarked")
        else:
            print(i)

    print(neighbors.score(X_test, y_test))
    #print(neighbors.predict(i))

main()
