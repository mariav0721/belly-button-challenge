//Create a variable for URL

let url='https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

function displayCharts(id) {

  console.log(id);

  //We need to fecth data again
  d3.json(url).then(function(data) {

    samples= data.samples;
    console.log(samples);

    //filter the data to get sample values

    let selectedSample = samples.filter(sample => sample.id == id);

    console.log(selectedSample);


    otuIds= selectedSample[0].otu_ids;
    otuLabels=selectedSample[0].otu_labels;
    sampleValues= selectedSample[0].sample_values;

    


  });

}

function optionChanged(selectedId) {

  displayCharts(selectedId);

}

function init(){

  d3.json(url).then(function(data) {

    console.log(data);
    //Fill the dropdown menu with all IDs

    let dropdownMenu= d3.select("#selDataset");

    console.log(data.names);

    let ids= data.names;
    for (let i=0; i<ids.length; i++) {
      dropdownMenu.append("option").text(ids[i]).property("value", ids[i]);
    }

    first=ids[0];

    //Display initial chart and panel with the first ID

    displayCharts(first);

  });
}

init()