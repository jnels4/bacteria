function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleSel = allSamples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleSelect = sampleSel[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var bacterias = data.samples;
    console.log(bacterias);
    var bacteriaIds =bacterias.filter(sampleObj => sampleObj.id == sample);
    //console.log(bacteriaIds);
    var otuId = bacteriaIds[0].otu_ids;
    var otuLabels = bacteriaIds[0].otu_labels;
    var sampleV = bacteriaIds[0].sample_values;
    var wfreq = parseFloat(sampleSelect.wfreq);

    //console.log(otuId)
    //console.log(otuLabels)
    //console.log(sampleV)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks =  sampleV.slice(0,10).sort((a,b) => a.population - b.population).reverse()
    //var yticks =  bacteriaIds.sort((a,b) => b.sample_values - a.sample_values).slice(0,10).reverse()
    var yticks = otuId.slice(0,10).reverse();
    console.log(yticks)
    console.log(sampleV.slice(0,10).reverse())
    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: "bar",
      x: sampleV.slice(0,10).reverse(),
      y: yticks.map(val => "OTU " + val),
      text: otuLabels.slice(0,10).reverse(),
      orientation: 'h'

    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Values",
     yaxis: {title: "bacteria ID"},
     xaxis: {title: "sample amount"},
     paper_bgcolor: "rgba(0,0,0,0)",
     plot_bgcolor: "rgba(0,0,0,0)"
    };

    maxSize = 40;
    
   // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuId,
      y: sampleV,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleV,
        color: otuId,//['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)']
        colorscale: "Viridis"
      },
      
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria found in sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      paper_bgcolor: "rgba(0,0,0,0)"
      
    };

    // 3. Use Plotly to plot the data with the layout.
     // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      //domain: {x: [0,1], y:[0,1]},
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Scrubs Per Week"},
      gauge: {
        axis: {range: [0, 10]},//, tickwidth: 1, tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red", },
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "green"},
          {range: [8,10], color: "blue"} 
        ],
        threshold: {
          line: { color: "cyan", width: 4},
          thicknesss: 0.75,
          value: 7
        }
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Washing Frequency",
      paper_bgcolor: "rgba(0,0,0,0)"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}