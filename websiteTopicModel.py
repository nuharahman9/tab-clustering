import pandas as pd 
import string 
import numpy as np 
import os 
from nltk import word_tokenize
from nltk.corpus import stopwords   
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF 
from collections import Counter 
import math
import re 


class websiteTopicModel: 
    n_components: int 
    vectorizer: TfidfVectorizer
    file_paths: list[str]
    topics: list[list[str]]
    topic_doc_map: list[str]    
    nmf_model: NMF 
    ps: PorterStemmer 
    H: np.ndarray 
    W: np.ndarray 
    stopwords: stopwords
        

    def __init__(self, n_components): 
        self.n_components = n_components
        self.vectorizer = TfidfVectorizer(norm='l2', smooth_idf=True, max_features=5000, max_df=0.95, ngram_range=(2, 3))
        self.file_paths = []
        self.tfidf_matrix = None 
        self.tokens = None 
        self.W = None 
        self.ps = PorterStemmer()
        self.stopwords = set(stopwords.words('english'))
        self.H = None 
        self.websites_preprocessed_data = [] 
        self.topics = [] 
        self.topic_doc_map = []

    def load_corpus_paths(self, path): 
        for filename in os.listdir(path): 
            file_path = path + filename 
            self.file_paths.append(file_path)
        
    def read_txt(self): 
            # read file contents by line 
        print("enter read_txt\n")
        for file_path in self.file_paths: 
            file = open(file_path, "r", encoding="utf-8")
            text = file.read() 
            text = re.sub(r'\n', '', text)
            text = re.sub(r'\d', '', text)
            text = text.translate(str.maketrans('', '', string.punctuation))
            text = text.strip()
            text = text.lower()
            tokenized_words = word_tokenize(text)
            tokenized_words = [w for w in tokenized_words if w not in self.stopwords]
            tokenized_words = [self.ps.stem(word) for word in tokenized_words]
            self.websites_preprocessed_data.append(' '.join(tokenized_words)) 
        print("finished processing text\n")
        
    
    def create_tfidf_matrix(self): 
        print("entering generate_nmf_model\n")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.websites_preprocessed_data)
        print(type(self.tfidf_matrix))
        print("vectorizer created\n")
    
    def generate_nmf_model(self): 
        if (self.n_components == -1): 
            self.approximate_best_n()
        else: 
            self.nmf_model = NMF(n_components=self.n_components, random_state=1, max_iter=150, solver='mu')
        self.W = self.nmf_model.fit_transform(self.tfidf_matrix)
        self.H = self.nmf_model.components_ 


    def approximate_best_n(self): 
        max = math.ceil(len(self.file_paths) / 2) 
        min = 2
        c = 0 
        min_error = float('inf')
        print("approximate_best_n: ", max, min)
        for i in range(min, max+2): # dont wanna have a window with just one page - open for suggestion on this one ?
            print('i = ', i)
            curr_nmf = NMF(n_components=i, random_state=60, solver='mu', max_iter=150)
            curr_nmf.fit_transform(self.tfidf_matrix) 
            if (curr_nmf.reconstruction_err_ < min_error): 
                min_error = curr_nmf.reconstruction_err_ 
                print(min_error)
                c = i 
        print("best number of components: ", c) 
        self.nmf_model = NMF(n_components=c, random_state=60, solver='mu', max_iter=150)
        print(type(self.nmf_model))



    def get_topics(self): 
        terms = self.vectorizer.get_feature_names_out()
        for index, topic in enumerate(self.H):
            self.topics.append([terms[i] for i in topic.argsort()[-3:]])
    
    def map_topics_to_websites(self): 
        self.topic_doc_map = {i: [] for i in range(self.nmf_model.n_components)}

        for doc_index, topic_scores in enumerate(self.W):
            max_topic_score = np.argmax(topic_scores)
            self.topic_doc_map[max_topic_score].append(self.file_paths[doc_index])
        
        return self.topic_doc_map
    
    def driver(self):
        self.load_corpus_paths('./corpus/')
        self.read_txt()
        self.create_tfidf_matrix()
        self.generate_nmf_model()
        self.get_topics() 
        return self.map_topics_to_websites() 














# def main(): 
#     file_paths = load_corpus('./corpus')
#     websites_preprocessed_data = [] 
#     for path in file_paths: 
#         websites_preprocessed_data.append(read_txt(path))
    
#     vectorizer = TfidfVectorizer(norm='l2', smooth_idf=True, ngram_range=(2, 3))
#     x = vectorizer.fit_transform(websites_preprocessed_data)

#     nmf_model = NMF(n_components=4, random_state=60)
#     W = nmf_model.fit_transform(x)
#     H = nmf_model.components_ 

#     terms = vectorizer.get_feature_names_out()
#     topics = [] 

#     for index, topic in enumerate(H):
#         topics.append([terms[i] for i in topic.argsort()[-3:]])
#         print([terms[i] for i in topic.argsort()[-4:]])


#     print(W)


        