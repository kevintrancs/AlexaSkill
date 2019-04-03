import nltk
# takes the sentence and separates the words
from nltk.tokenize import word_tokenize
import numpy as np
import random
import csv
import pickle
from collections import Counter
# stemming removed ings/eds/ groups similar words to create one word in the lexicon
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
hm_lines = 100000


def create_lexicon(pos):
    lexicon = []
    with open(pos, 'r') as f:
        contents = csv.reader(f, delimiter=',')
        for row in contents:
            separated_data = list(row)
            all_words = word_tokenize(separated_data[3])
            lexicon += list(all_words)

    lexicon = [lemmatizer.lemmatize(i) for i in lexicon]
    # creates a dictionary of words (w_counts = {'the':5432, 'and': 2345})
    w_counts = Counter(lexicon)
    l2 = []
    for w in w_counts:
        # this will only give us words that are not too common
        if  w_counts[w] > 300:
            l2.append(w)
    print(len(l2))
    return l2  # is the final lexicon


def sample_handling(sample, lexicon):
    featureset = []

    with open(sample, 'r') as f:
        contents = f.readlines()  # reads the sample file
        for l in contents[:hm_lines]:  # read each line in our file
            current_words = word_tokenize(l.lower())
            current_words = [lemmatizer.lemmatize(i) for i in current_words]
            features = np.zeros(len(lexicon))
            for word in current_words:  # iterate through our words
                if word.lower() in lexicon:
                    # increment the index value where our word is in the lexicon
                    index_value = lexicon.index(word.lower())
                    features[index_value] += 1

            features = list(features)
            # append a list of lists that includes the incremented features and classification for it
            featureset.append([features])

    return featureset


def create_feature_sets_and_labels(pos, test_size=0.1):  # 10 percent test size
    lexicon = create_lexicon(pos)
    features = []
    features += sample_handling('NewsHashed.csv', lexicon)
    # shuffle for the neural network so that it doesn't train the data shifting towards the pos or neg
    random.shuffle(features)
    features = np.array(features)

    testing_size = int(test_size * len(features))

    #:,0   [[5,8],[7,9]]
    # all of the zeroith elements
    # so this takes only the feature set without the label up to the 10 %
    train_x = list(features[:, 0][:-testing_size])
    train_y = list(features[:, 1][:-testing_size])
    test_x = list(features[:, 0][-testing_size:])  # the last 10%
    test_y = list(features[:, 1][-testing_size:])

    return train_x, train_y, test_x, test_y


#if __name__ == '__main__':
    #train_x, train_y, test_x, test_y = create_feature_sets_and_labels('animals')
    '''
    # if you want to pickle this data:
    with open('/path/to/sentiment_set.pickle','wb') as f:
        pickle.dump([train_x,train_y,test_x,test_y],f)		
        '''

print(create_lexicon('animals'))