function geo() {

    var width = document.getElementById("geo").offsetWidth,
        height = document.getElementById("geo").offsetHeight,
        margin = 10;

    var tooltip = d3.select("#geo")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    var svg = d3.select("#geo")
        .attr("class", "geo")
        .append("svg")
        .attr("viewBox", "0 0 900 500")
        .attr("preserveAspectRatio", "xMidYMid meet");

    svg.style("overflow", "hidden")
        .style("z-index", 0)

    d3.csv("data/acled.csv").then(function (data) {

        // var eventtype = ["Peaceful protest", "Attack", "Protest with intervention", "Other", "Violent demonstration", "Change to group/activity", "Excessive force against protesters", "Armed clash", "Disrupted weapons use", "Looting/property destruction", "Mob violence", "Sexual violence", "Arrests"]; // incase you need a colorscheme reference;

        let projection = d3.geoMercator()
            .scale(600)
            .translate([1320, 650])

        let path = d3.geoPath()
            .projection(projection);

        d3.json("data/us-states.geojson").then(function (swiss) {

            console.log(data.length);
            var event_type = [];
            //            data = data.slice(0, 5000)

            data.forEach(function (d) {
                if (event_type.includes(d.SUB_EVENT_TYPE) == false) {
                    event_type.push(d.SUB_EVENT_TYPE);
                };
            })

            let eventtypeScale = d3.scaleOrdinal()
                .domain(event_type)
                .range(d3.schemeCategory10);

            var group = svg.selectAll("g")
                .data(swiss.features)
                .enter()
                .append("g");

            var node = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", function (d) {
                    if (d.SUB_EVENT_TYPE == "Excessive force against protesters" || d.SUB_EVENT_TYPE == "Disrupted weapons use" || d.SUB_EVENT_TYPE == "Armed clash") {
                        return 3;
                    } else if (d.SUB_EVENT_TYPE == "Peaceful protest" || d.SUB_EVENT_TYPE == "Protest with intervention" || d.SUB_EVENT_TYPE == "Other" || d.SUB_EVENT_TYPE == "Change to group/activity") {
                        return 1;
                    } else {
                        return 2;
                    }
                })
                .attr("cx", function (d) {
                    return projection([+d.LONGITUDE, +d.LATITUDE])[0];
                })
                .attr("cy", function (d) {
                    return projection([+d.LONGITUDE, +d.LATITUDE])[1];
                })
                .style("fill", function (d) {
                    return eventtypeScale(d.SUB_EVENT_TYPE)
                });

            //            var simulation = d3.forceSimulation()
            //                .force("x",
            //                    d3.forceX()
            //                    .strength(0.5)
            //                    .x(function (d) {
            //                        return projection([+d.LONGITUDE, +d.LATITUDE])[0];
            //                    }))
            //                .force("y",
            //                    d3.forceY()
            //                    .strength(0.5)
            //                    .y(function (d) {
            //                        return projection([+d.LONGITUDE, +d.LATITUDE])[1];
            //                    }))
            //                .force("collide", d3.forceCollide().strength(1)
            //                    .radius(function (d) {
            //                        if (d.SUB_EVENT_TYPE == "Excessive force against protesters" || d.SUB_EVENT_TYPE == "Disrupted weapons use" || d.SUB_EVENT_TYPE == "Armed clash") {
            //                            return 4.5;
            //                        } else if (d.SUB_EVENT_TYPE == "Peaceful protest" || d.SUB_EVENT_TYPE == "Protest with intervention" || d.SUB_EVENT_TYPE == "Other" || d.SUB_EVENT_TYPE == "Change to group/activity") {
            //                            return 1.5;
            //                        } else {
            //                            return 2.5;
            //                        }
            //                    })
            //                    .iterations(1))
            //
            //            simulation
            //                .nodes(data)
            //                .on("tick", function (d) {
            //                    node
            //                        .attr("cx", function (d) {
            //                            return d.x;
            //                        })
            //                        .attr("cy", function (d) {
            //                            return d.y;
            //                        })
            //                });

            var path = d3.geoPath().projection(projection);

            var areas = group.append("path")
                .attr("d", path)
                .attr("fill", "#2e2e2e");

        });


    });
};
