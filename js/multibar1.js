function yelei88() {

    // set the dimensions and margins of the graph
    var margin = {
            top: 150,
            right: 30,
            bottom: 20,
            left: 50
        },
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#mybar2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("data/proverty2.csv").then(function (data) {

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) {
            return d.group
        });

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(8));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 40])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.5])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#D5C5C8", "#9DA3A4", "#604D53", "#54001c", "#DB7F8E", "#FFDBDA", "#FFB4A2"])

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + x(d.group) + ",0)";
            })
            .selectAll(".bar")
            .data(function (d) {
                return subgroups.map(function (key) {
                    return {
                        key: key,
                        value: d[key]
                    };
                });
            })
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return xSubgroup(d.key);
            })
            .transition()
            .delay(function (d) {
                return Math.random() * 1000;
            })
            .duration(1000)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", function (d) {
                return color(d.key);
            })


    })

};

yelei88();
