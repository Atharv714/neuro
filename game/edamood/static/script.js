const healthAnalysis = {
    happy: { "Mental Health": 9, "Physical Health": 8, "Energy Levels": 9, "Stress Levels": 2, "Sleep Quality": 8, "Social Interaction": 9 },
    sad: { "Mental Health": 4, "Physical Health": 5, "Energy Levels": 3, "Stress Levels": 7, "Sleep Quality": 5, "Social Interaction": 4 },
    angry: { "Mental Health": 3, "Physical Health": 4, "Energy Levels": 6, "Stress Levels": 9, "Sleep Quality": 4, "Social Interaction": 3 },
    anxious: { "Mental Health": 5, "Physical Health": 4, "Energy Levels": 4, "Stress Levels": 8, "Sleep Quality": 5, "Social Interaction": 5 }
};

function generateCharts() {
    const emotion = document.getElementById("emotion").value;
    const data = healthAnalysis[emotion];

    const categories = Object.keys(data);
    const values = Object.values(data);

    // Bar Chart
    const barChart = {
        type: 'bar',
        x: categories,
        y: values,
        marker: { color: ['blue', 'green', 'orange', 'red', 'purple', 'cyan'] }
    };

    const barLayout = {
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} - Bar Chart`,
        xaxis: { title: 'Health Categories' },
        yaxis: { title: 'Health Score (1-10)' }
    };

    Plotly.newPlot('bar-chart', [barChart], barLayout);

    // Pie Chart
    const pieChart = {
        type: 'pie',
        labels: categories,
        values: values,
        marker: { colors: ['blue', 'green', 'orange', 'red', 'purple', 'cyan'] }
    };

    const pieLayout = {
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} - Pie Chart`
    };

    Plotly.newPlot('pie-chart', [pieChart], pieLayout);

    // Line Chart
    const lineChart = {
        type: 'scatter',
        mode: 'lines+markers',
        x: categories,
        y: values,
        line: { color: 'magenta' },
        marker: { color: 'magenta' }
    };

    const lineLayout = {
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} - Line Chart`,
        xaxis: { title: 'Health Categories' },
        yaxis: { title: 'Health Score' }
    };

    Plotly.newPlot('line-chart', [lineChart], lineLayout);

    // Scatter Plot
    const scatterChart = {
        type: 'scatter',
        mode: 'markers',
        x: categories,
        y: values,
        marker: { color: 'brown', size: 10 }
    };

    const scatterLayout = {
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} - Scatter Plot`,
        xaxis: { title: 'Health Categories' },
        yaxis: { title: 'Health Score' }
    };

    Plotly.newPlot('scatter-chart', [scatterChart], scatterLayout);

    // Histogram
    const histogramChart = {
        type: 'histogram',
        x: values,
        nbinsx: 5,
        marker: { color: 'teal' }
    };

    const histogramLayout = {
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} - Histogram`,
        xaxis: { title: 'Health Score' },
        yaxis: { title: 'Frequency' }
    };

    Plotly.newPlot('histogram-chart', [histogramChart], histogramLayout);
}
