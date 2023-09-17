// Create a variable for URL
let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Define the createBarAndBubbleChart function
function createBarChart(otuIds, sampleValues) {

  const margin = {
    top: 10,
    right: 70,
    bottom: 70,
    left: 70
  };

  // Clear the previous charts if they exist
  d3.select("#bar").html("");
  d3.select("#bubble").html("");

  // chart dimensions
  const barWidth = 900; 
  const barHeight = 200; 

  // Create an SVG element with the specified dimensions for the bar chart
  const svg = d3
    .select("#bar")
    .append("svg")
    .attr("width", barWidth)
    .attr("height", barHeight);

  // Calculate the inner width and height for the charts
  const innerWidth = barWidth - margin.left - margin.right;
  const innerHeight = barHeight - margin.top - margin.bottom;

  // Create scales for the bar chart
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(sampleValues)])
    .range([0, innerWidth]);

  const y = d3
    .scaleBand()
    .domain(otuIds.map(id => `OTU ${id}`))
    .range([0, innerHeight])
    .padding(0.1);

  // Create a group for the bars in the bar chart
  const bars = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create and append the bars in the bar chart
  bars
    .selectAll("rect")
    .data(sampleValues)
    .enter()
    .append("rect")
    .attr("y", (d, i) => y(`OTU ${otuIds[i]}`))
    .attr("width", d => x(d))
    .attr("height", y.bandwidth())
    .attr("fill", "purple");

  // Create X and Y axes for the bar chart
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Append the X and Y axes for the bar chart
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${margin.left},${innerHeight + margin.top})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(yAxis);

  // Add labels for the axes in the bar chart
  svg
    .append("text")
    .attr("class", "x-label")
    .attr("x", barWidth / 2)
    .attr("y", barHeight - margin.bottom / 2)
    .text("Sample Values");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("x", -barHeight / 2)
    .attr("y", margin.left / 2)
    .attr("transform", "rotate(-20)")
    .text("OTU IDs");
}

//Define function to create Bubble Chart
function createBubbleChart(otuIds, sampleValues, otuLabels) {
  let bubble = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels, // Use the OTU labels for text
    mode: "markers",
    marker: {
      color: otuIds,
      colorscale: "yellow",
      size: sampleValues,
    },
    type: "scatter",
  };

  let chart = [bubble];

  let layout = {
    xaxis: {
      title: { text: "OTU ID" },
    },
  };

  Plotly.newPlot("bubble", chart, layout);
}

//create metadata fucntion 

function createMetaData(demographicInfo) {
  let demoSelect = d3.select("#sample-metadata");

  // Create an HTML string with key-value pairs
  let htmlString = "";
  for (const [key, value] of Object.entries(demographicInfo)) {
    htmlString += `${key}: ${value} <br>`;
  }

  // Set the HTML content of the sample-metadata element
  demoSelect.html(htmlString);
}



function displayBarChart(id) {
  // Fetch data
  d3.json(url).then(function (data) {
    samples = data.samples;

    // Find the selected sample
    let selectedSample = samples.find(sample => sample.id == id);

    // Extract OTU IDs and sample values
    let otuIds = selectedSample.otu_ids.slice(0, 10); // Slice to get the top 10
    let sampleValues = selectedSample.sample_values.slice(0, 10); // Slice to get the top 10

    // Call the createBarChart function with your data
    createBarChart(otuIds, sampleValues);
  });
}

function displayBubbleChart(id) {
  // Fetch data
  d3.json(url).then(function (data) {
    samples = data.samples;

    // Find the selected sample
    let selectedSample = samples.find(sample => sample.id == id);

    // Extract OTU IDs, sample values, and OTU labels
    let otuIds = selectedSample.otu_ids;
    let sampleValues = selectedSample.sample_values;
    let otuLabels = selectedSample.otu_labels;

    // Call the createBubbleChart function with your data
    createBubbleChart(otuIds, sampleValues, otuLabels);

    // Display metadata
    createMetaData(data.metadata.find(metadata => metadata.id == id));
  });
}

// Define the init function
function init() {
  // Fetch initial data
  d3.json(url).then(function (data) {
    // Fill the dropdown menu with all IDs
    let dropdownMenu = d3.select("#selDataset");
    let ids = data.names;

    for (let i = 0; i < ids.length; i++) {
      dropdownMenu.append("option").text(ids[i]).property("value", ids[i]);
    }

    // Display initial chart and panel with the first ID
    let first = ids[0];
    displayBarChart(first);
    displayBubbleChart(first); // Add this line to display the bubble chart initially
  });
}

function optionChanged(selectedId) {
  // Call the displayBarChart and displayBubbleChart functions with the selected ID
  displayBarChart(selectedId);
  displayBubbleChart(selectedId);
}

// Call the init function to initialize the page
init();