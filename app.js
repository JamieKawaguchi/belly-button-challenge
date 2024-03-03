// Function to fetch data from the provided URL
function fetchData(url) {
  return fetch(url).then(response => response.json());
}

// Function to create bar chart
function createBarChart(data) {
  // Get top 10 OTUs
  var top10OTUs = data.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  var top10Values = data.sample_values.slice(0, 10).reverse();
  var top10Labels = data.otu_labels.slice(0, 10).reverse();

  var trace = {
      x: top10Values,
      y: top10OTUs,
      type: 'bar',
      orientation: 'h',
      text: top10Labels
  };

  var layout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
  };

  var data = [trace];

  Plotly.newPlot('bar', data, layout);
}

// Function to create bubble chart
function createBubbleChart(data) {
  var trace = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
          size: data.sample_values,
          color: data.otu_ids,
          colorscale: 'Earth'
      },
      text: data.otu_labels
  };

  var layout = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
  };

  var data = [trace];

  Plotly.newPlot('bubble', data, layout);
}

// Function to display sample metadata
function displayMetadata(metadata) {
  var metadataDiv = d3.select('#sample-metadata');
  metadataDiv.html('');

  Object.entries(metadata).forEach(([key, value]) => {
      metadataDiv.append('p').text(`${key}: ${value}`);
  });
}

// Function to handle dropdown selection change
function optionChanged(sampleId) {
  fetchData('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json')
      .then(data => {
          var sampleData = data.samples.find(sample => sample.id === sampleId);
          var metadata = data.metadata.find(sample => sample.id === parseInt(sampleId));

          createBarChart(sampleData);
          createBubbleChart(sampleData);
          displayMetadata(metadata);
      })
      .catch(error => console.log('Error fetching data:', error));
}

// Function to initialize the dashboard
function init() {
  fetchData('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json')
      .then(data => {
          var sampleIds = data.names;

          var dropdownMenu = d3.select('#selDataset');
          sampleIds.forEach(id => {
              dropdownMenu.append('option').text(id).property('value', id);
          });

          // Initial data to display
          var initialSampleId = sampleIds[0];
          optionChanged(initialSampleId);
      })
      .catch(error => console.log('Error fetching data:', error));
}

// Initialize the dashboard
init();

  