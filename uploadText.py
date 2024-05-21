from flask import Flask, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'corpus'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_text():
    data = request.get_json()
    url = data.get('url')
    content = data.get('content')

    if url and content:
        filename = url.replace('http://', '').replace('https://', '').replace('/', '_') + '.txt'
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)

        return jsonify({'status': 'success', 'filename': filename}), 200
    else:
        return jsonify({'status': 'failure', 'reason': 'Invalid data'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
