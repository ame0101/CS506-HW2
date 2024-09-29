from flask import Flask, render_template, jsonify, request
import numpy as np

app = Flask(__name__)


current_state = {}

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate_data', methods=['POST'])
def generate_data():
    n_points = int(request.json['n_points'])
    data = np.random.rand(n_points, 2) * 100   

    global current_state
    current_state = {}
    return jsonify({'data': data.tolist()})


@app.route('/step_kmeans', methods=['POST'])
def step_kmeans():
    points = np.array(request.json['points'])
    k = int(request.json['k'])

    if 'centroids' not in current_state:

        centroids = points[np.random.choice(points.shape[0], k, replace=False)]
        labels = np.zeros(points.shape[0])
    else:

        centroids = current_state['centroids']
        labels = current_state['labels']


    distances = np.sqrt(((points - centroids[:, np.newaxis])**2).sum(axis=2))
    new_labels = np.argmin(distances, axis=0)
    new_centroids = np.array([points[new_labels == i].mean(axis=0) for i in range(k)])


    current_state['centroids'] = new_centroids
    current_state['labels'] = new_labels

    return jsonify({
        'centroids': new_centroids.tolist(),
        'labels': new_labels.tolist()
    })


@app.route('/reset', methods=['POST'])
def reset():
    global current_state
    current_state = {}
    return jsonify({'status': 'reset'})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
