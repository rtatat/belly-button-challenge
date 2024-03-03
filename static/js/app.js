// Reading in the samples.json file from the URL source using the D3 library
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then((data) => {

    // Populating the dropdown menu
    var select = d3.select("#selDataset");
    data.names.forEach((name) => {
        select.append("option").text(name).property("value", name);
    });

    // Getting the first sample onto the page
    var firstSample = data.names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    // Initialize the page with the first sample for gauge chart
    buildGaugeChart(firstSample);
});

// Function to build the metadata panel
function buildMetadata(sample) {
    d3.json(url).then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        // Clear any existing metadata
        PANEL.html("");

        // Adding the data pairs to the panel
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to build the bar chart and other charts if you extend functionality
function buildCharts(sample) {
    d3.json(url).then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Build a Bar Chart
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [{
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }];

        var barLayout = {
            title: "The 10 Most Prolific Bacterial Cultures Found",
            margin: { t: 50, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Build a Bubble Chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            showlegend: false,
            height: 600,
            width: 1200,
            xaxis: { title: "OTU ID" },
            hovermode: "closest"
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });

}

// Function to handle the change event
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}