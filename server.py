# Importing dependencies
from urllib.parse import urlparse
from tld import get_tld
import pandas as pd
import pickle
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

#First Directory Length
def fd_length(url):
    urlpath= urlparse(url).path
    try:
        return len(urlpath.split('/')[1])
    except:
        return 0

#Length of Top Level Domain
def tld_length(tld):
    try:
        return len(tld)
    except:
        return 0

def digit_count(url):
    digits = 0
    for i in url:
        if i.isnumeric():
            digits = digits + 1
    return digits

def letter_count(url):
    letters = 0
    for i in url:
        if i.isalpha():
            letters = letters + 1
    return letters

def no_of_dir(url):
    urldir = urlparse(url).path
    return urldir.count('/')

def shortening_service(url):
    match = re.search('bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|'
                      'yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|'
                      'short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|'
                      'doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|'
                      'db\.tt|qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|'
                      'q\.gs|is\.gd|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|'
                      'x\.co|prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|'
                      'tr\.im|link\.zip\.net',
                      url)
    if match:
        return 1
    else:
        return 0

def pre_processing(url):
    data_to_predict = pd.DataFrame([[url]], columns=['url'])
    data_to_predict['url'] = data_to_predict['url'].replace('www.', '', regex=True)
    data_to_predict['url_length'] = data_to_predict['url'].apply(lambda x: len(str(x)))
    data_to_predict['hostname_length'] = data_to_predict['url'].apply(lambda i: len(urlparse(i).netloc))
    data_to_predict['path_length'] = data_to_predict['url'].apply(lambda i: len(urlparse(i).path))
    data_to_predict['fd_length'] = data_to_predict['url'].apply(lambda i: fd_length(i))
    data_to_predict['tld'] = data_to_predict['url'].apply(lambda i: get_tld(i,fail_silently=True))
    data_to_predict['tld_length'] = data_to_predict['tld'].apply(lambda i: tld_length(i))
    data_to_predict = data_to_predict.drop("tld",1)
    data_to_predict['count-'] = data_to_predict['url'].apply(lambda i: i.count('-'))
    #data_to_predict['count@'] = data_to_predict['url'].apply(lambda i: i.count('@'))
    data_to_predict['count?'] = data_to_predict['url'].apply(lambda i: i.count('?'))
    data_to_predict['count%'] = data_to_predict['url'].apply(lambda i: i.count('%'))
    data_to_predict['count.'] = data_to_predict['url'].apply(lambda i: i.count('.'))
    data_to_predict['count='] = data_to_predict['url'].apply(lambda i: i.count('='))
    data_to_predict['count-http'] = data_to_predict['url'].apply(lambda i : i.count('http'))
    data_to_predict['count-https'] = data_to_predict['url'].apply(lambda i : i.count('https'))
    data_to_predict['count-www'] = data_to_predict['url'].apply(lambda i: i.count('www'))
    data_to_predict['count-digits']= data_to_predict['url'].apply(lambda i: digit_count(i))
    data_to_predict['count-letters']= data_to_predict['url'].apply(lambda i: letter_count(i))
    data_to_predict['count_dir'] = data_to_predict['url'].apply(lambda i: no_of_dir(i))
    #data_to_predict['use_of_ip'] = data_to_predict['url'].apply(lambda i: having_ip_address(i))
    data_to_predict['short_url'] = data_to_predict['url'].apply(lambda i: shortening_service(i))
    data_to_predict = data_to_predict.drop("url",1)

    return data_to_predict

# load the model from disk
loaded_model = pickle.load(open("link_classification_trained_ml_model.pickle", 'rb'))

#setup server
server = Flask(__name__)
cors = CORS(server)

# Create the receiver API POST endpoint at the server:
@server.route("/receiver", methods=["POST"])
def postME():
    requestdata = request.get_json()
    print(requestdata)
    hoverdlink = requestdata[0]['link']
    linkdict = []
    test_dataframe = pre_processing(hoverdlink)
    pred = loaded_model.predict(test_dataframe)
    print(pred)
    if (pred == 0):
        print("Benign")
        linkdict = [{'link': 'Benign'}]
    else:
        print("Malicious")
        linkdict = [{'link': 'Malicious'}]
    print(linkdict)
    responsedata = jsonify(linkdict)
    print(responsedata)
    return responsedata

if __name__ == "__main__":
    server.run()