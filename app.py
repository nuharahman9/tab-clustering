from flask import Flask, request, jsonify
from websiteTopicModel import websiteTopicModel
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'corpus'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

nmf_model = None 
url_id_map = {} 


@app.route('/cluster', methods=['GET'])
def cluster(): 
    # add something here that takes the number of windows and init nmf here instead - still need to grab this from javascript 
    global nmf_model
    global url_id_map 
    

    nmf_model = websiteTopicModel() 
    topics_website_ids_map = {}
    print(url_id_map)
    print("in cluster!!!\n")
    topic_doc_map = nmf_model.driver()
    print(topic_doc_map)
    if topic_doc_map: 
        for topicNum, documents in topic_doc_map: 
            for doc in documents: 
                topics_website_ids_map[topicNum].append(url_id_map[doc]) # get corresponding tab id - should change later but jsut for the sake of testing so we can see the grouping of topics in our terminal instead of looking at tab id's! :)
        print(topics_website_ids_map) 
        return jsonify({
            'groups': topics_website_ids_map, 
            'status': 200, 
            'message': 'biiiitch'
        })
    else: 
        return jsonify({
            'status': 400, 
            'message': 'something went wrong. HELP'
        })


@app.route('/upload', methods=['POST']) 
def upload_text():
    data = request.get_json()
    url = data.get('url')
    id = data.get('id')
    title = data.get('title')
    text = data.get('text')

    global url_id_map
    if url and text:
        filename = url.replace('http://', '').replace('https://', '').replace('/', '_')
        # truncate file name 
        filename = (data[:20] + '..') if len(data) > 20 else filename 
        filename += '.txt'
        url_id_map[filename] = id 
        filepath = os.path.join(UPLOAD_FOLDER, filename) # create file under tab id 
        with open(filepath, 'a', encoding='utf-8') as file:
            file.write(url) 
            file.write('\n')
            file.write(title)
            file.write('\n')
            file.write(text)
        return jsonify({'status': 'success', }), 200
    else:
        return jsonify({'status': 'failure', 'reason': 'Invalid data'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
