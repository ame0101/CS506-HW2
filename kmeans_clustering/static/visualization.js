let dataPoints = [];
let centroids = [];
let clusters = [];
let numClusters = 3;   

function generateData() {
    fetch('/generate_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n_points: 100 })  
    })
    .then(response => response.json())
    .then(data => {
        dataPoints = data['data'];
        plotData(dataPoints, [], []);
    });
}


function stepThroughKMeans() {
    const k = document.getElementById('clusters').value || numClusters;

    fetch('/step_kmeans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: dataPoints, k: k })
    })
    .then(response => response.json())
    .then(result => {
        centroids = result.centroids;
        clusters = result.labels;
        plotData(dataPoints, centroids, clusters);  
    });
}

// Reset the algorithm
function resetAlgorithm() {
    fetch('/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(() => {
        centroids = [];
        clusters = [];
        plotData(dataPoints, [], []);   
    });
}


function plotData(points, centroids, labels) {
    let colors = ['blue', 'green', 'orange', 'purple', 'brown', 'pink'];   

    let pointTrace = {
        x: points.map((p, i) => p[0]),
        y: points.map((p, i) => p[1]),
        mode: 'markers',
        marker: { size: 8, color: labels.length ? labels.map(l => colors[l % colors.length]) : 'black' },
        type: 'scatter',
        name: 'Data Points'
    };

    let centroidTrace = {
        x: centroids.map(c => c[0]),
        y: centroids.map(c => c[1]),
        mode: 'markers',
        marker: { size: 12, color: 'red', symbol: 'cross' },
        type: 'scatter',
        name: 'Centroids'
    };

    const layout = {
        title: 'KMeans Clustering',
        xaxis: { range: [0, 100], title: 'X Axis' },
        yaxis: { range: [0, 100], title: 'Y Axis' }
    };

    Plotly.newPlot('plot', [pointTrace, centroidTrace], layout);
}
