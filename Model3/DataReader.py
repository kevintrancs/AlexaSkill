# imports
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


def load_data(path, header):
    news_df = pd.read_csv(path, header=0)
    return news_df


if __name__ == "__main__":
    # load the data from the file
    data = load_data("NewsHashed.csv", None)

    # X = feature values, columns 8 and 10
    X = data.iloc[:, [8, 10]]

    # y = target values, last column of the data frame
    y = data.iloc[:, 13]

    # filter out the articles that are recommended
    recommended = data.loc[(y == 2) | (y == 3)]

    # filter out the applicants that aren't recommended
    not_recommended = data.loc[(y == 0) | (y == 1) | (y == 4) | (y == 5) | (y == 6) | (y == 7) | (y == 8) | (y == 9) |
                               (y == 10) | (y == 11)]

    # prepare data for model
    X = np.c_[np.ones((X.shape[0], 1)), X]
    y = y[:, np.newaxis]
    theta = np.zeros((X.shape[1], 1))

    # model
    model = LogisticRegression()
    model.fit(X,y)
    predicted_classes = model.predict(X)
    accuracy = accuracy_score(y.flatten(), predicted_classes)
    parameters = model.coef_

    # testing
    print(accuracy)

    # plots
    plt.scatter(recommended.iloc[:25, 8], recommended.iloc[:25, 10], s=10, label='Recommended')
    plt.scatter(not_recommended.iloc[:25, 8], not_recommended.iloc[:25, 10], s=10, label='Not Recommended')
    plt.legend()
    plt.show()