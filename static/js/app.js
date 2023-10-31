//
let Bio_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(Bio_url).then(function(data) {

    let Bio_samples = data.samples;
    let metadata = data.metadata;
    let id= data.names;

    function buildBarChart(Bacteria_ID) {
        let sample_values = Bio_samples[Bacteria_ID].sample_values;
        let otu_ids = Bio_samples[Bacteria_ID].otu_ids;
        let otu_labels = Bio_samples[Bacteria_ID].otu_labels;

        let trace1 = {
            x: sample_values.slice(0, 10),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`), // Label OTU IDs
            text: otu_labels,
            type: 'bar',
            orientation: 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'}]

        };

        let data = [trace1];
        let layout = {
            title: "Operational Taxonomic Units",
            xaxis: {title: 'Sample Values'},
            yaxis: {title: 'OTUs'}
        };

        Plotly.newPlot("bar", data, layout);
    }

    function buildBubbleChart(Bacteria_ID) {
        let sample_values = Bio_samples[Bacteria_ID].sample_values;
        let otu_ids = Bio_samples[Bacteria_ID].otu_ids;
        let otu_labels = Bio_samples[Bacteria_ID].otu_labels;

        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: 'Accent'}
            }

            let data = [trace];

            let layout = {
                title: "Sample values per OTU ID",
                xaxis: {title:`OTU ID`},
                yaxis: {title: 'Sample Values'}
            };

            Plotly.newPlot('bubble', data, layout)
        }

    function buildMetadata(Bacteria_ID, metadata) {
        d3.select("#sample-metadata").html("");

        let panelBody = d3.select("#sample-metadata").append("div")
            .attr("class", "panel-body");

        let fields = ["id", "ethnicity", "gender", "age", "location", "bbtype", "wfreq"];

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            panelBody.append("p").style("font-size", "14px").text(`${field}: ${metadata[Bacteria_ID][field]}`);
        };

    }

    function buildGaugeBar(Bacteria_ID){
        let washingFrequency = metadata[Bacteria_ID].wfreq

        let data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washingFrequency,
                title: { text: "Belly Button Washing Frequency " +
                        "Scrubs per week" },
                type: "indicator",
                mode: "gauge+number",
                text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
                direction: 'clockwise',
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: ['', '', '', '', '', '', '', '', ''],
                    labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
                    hoverinfo: 'label'
                },
                gauge: {
                    axis: {
                        range: [0, 9],
                        tickmode: "linear"
                    },
                    steps: [
                        { range: [0, 1], color: "#ebedef", name: "0-1" },
                        { range: [1, 2], color: "#f6ddcc" },
                        { range: [2, 3], color: "#fcf3cf" },
                        { range: [3, 4], color: "#abebc6" },
                        { range: [4, 5], color: "#7dcea0" },
                        { range: [5, 6], color: "#27ae60" },
                        { range: [6, 7], color: "#28b463" },
                        { range: [7, 8], color: "#1e8449" },
                        { range: [8, 9], color: "#145a32" }
                    ]
                }
            }
        ];

        let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
    }

    function optionChanged(Bacteria_ID) {
        buildBarChart(Bacteria_ID);
        buildMetadata(Bacteria_ID, metadata);
        buildGaugeBar(Bacteria_ID);
        buildBubbleChart(Bacteria_ID);
    }

    let dropdown = d3.select('#selDataset');

    for (let i = 0; i < id.length; i++) {
        let option = dropdown.append('option');
        option.attr('value', i).text(id[i]);
    }

    dropdown.on('change', function() {
        let Bacteria_ID = +this.value;
        optionChanged(Bacteria_ID);
    });

    optionChanged(0)
    }
);