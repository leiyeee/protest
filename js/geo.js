function geo() {

    var width = document.getElementById("geo").offsetWidth,
        height = document.getElementById("geo").offsetHeight,
        margin = 0;

    console.log(height);

    var tooltip = d3.select("#geo")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    var svg = d3.select("#geo")
        .attr("class", "geo")
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + width / 1.8)
        .attr("preserveAspectRatio", "xMidYMid meet")

    svg.style("overflow", "hidden")
        .style("z-index", 0)

    d3.csv("data/acled.csv").then(function (data) {

        // var eventtype = ["Peaceful protest", "Attack", "Protest with intervention", "Other", "Violent demonstration", "Change to group/activity", "Excessive force against protesters", "Armed clash", "Disrupted weapons use", "Looting/property destruction", "Mob violence", "Sexual violence", "Arrests"]; // incase you need a colorscheme reference;

        let projection = d3.geoMercator()
            .scale(800)
            .translate([1750, 850])

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
            });

            event_type = ["Disruptive Protest", "Violent Protest", "Peaceful Protest"]

            let eventtypeScale = d3.scaleOrdinal()
                .domain(event_type)
                .range(["red", "pink", "white"]);
            //
            //            const zoom = d3.zoom()
            //                .scaleExtent([1, 40])
            //                .translateExtent([[0, 0], [width, height]])
            //                .extent([[0, 0], [width, height]])
            //                .on("zoom", zoomed);
            //
            //            svg.call(zoom);

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
                    if (d.SUB_EVENT_TYPE == "Excessive force against protesters" || d.SUB_EVENT_TYPE == "Disrupted weapons use" || d.SUB_EVENT_TYPE == "Armed clash") {
                        return "red";
                    } else if (d.SUB_EVENT_TYPE == "Peaceful protest" || d.SUB_EVENT_TYPE == "Protest with intervention" || d.SUB_EVENT_TYPE == "Other" || d.SUB_EVENT_TYPE == "Change to group/activity") {
                        return "white";
                    } else {
                        return "pink";
                    }
                })
                /*  .on("mouseover", function (d) {
                          tooltip.transition()
                              .duration(200)
                              .style("opacity", .9);
                          tooltip.html(d.SUB_EVENT_TYPE)
                              .style("left", (d3.event.pageX) + "px")
                              .style("top", (d3.event.pageY - 28) + "px");
                      })
                      .on("mouseout", function (d) {
                          div.transition()
                              .duration(500)
                              .style("opacity", 0);
                      })*/
                .on("click", function (event, d) {
                    showEdition(d);
                })
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);




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

            var legend = svg.append("g")
                .attr('class', 'legend')
            //.attr('transform', `translate(${svg.width * 2.8 / 4}, ${svg.height - 20})`);

            var legendlabel = svg.append("g")
                .attr('class', 'legendlabel')
            //.attr('transform', `translate(${svg.width * 2.8 / 4}, ${svg.height - 20})`);

            //            legendlabel.selectAll()
            //                .data(event_type)
            //                .enter()
            //                .append('text')
            //                .text((d, i) => (d))
            //                .attr("font-size", 10)
            //                .attr("x", 680)
            //                .attr("y", (d, i) => i * 23 + 30)
            //                .attr("fill", "white")
            //                .style("font-size", "14px")
            //            .style("font-family", "'Roboto', sans-serif")
            //            .style("font-weight", 200)
            //
            //            legend.selectAll()
            //                .data(event_type)
            //                .enter()
            //                .append('rect')
            //                .attr("x", 650)
            //                .attr("y", (d, i) => i * 23 + 20)
            //                .attr("width", 10)
            //                .attr("height", 10)
            //                .style("fill", function (d) {
            //                    return eventtypeScale(d)
            //                })

            function handleMouseOver(d, i) {
                d3.select(this).attr("r", 5);
            };

            function handleMouseOut(d, i) {
                d3.select(this).attr("r", function (d) {
                    if (d.SUB_EVENT_TYPE == "Excessive force against protesters" || d.SUB_EVENT_TYPE == "Disrupted weapons use" || d.SUB_EVENT_TYPE == "Armed clash") {
                        return 3;
                    } else if (d.SUB_EVENT_TYPE == "Peaceful protest" || d.SUB_EVENT_TYPE == "Protest with intervention" || d.SUB_EVENT_TYPE == "Other" || d.SUB_EVENT_TYPE == "Change to group/activity") {
                        return 1;
                    } else {
                        return 2;
                    }
                })
            };

            function showEdition(d) {
                var info1 =
                    "<b>Time:</b> " + d.EVENT_DATE + "<br>" +
                    "<b>Location:</b> " + d.LOCATION + " in " + d.ADMIN1 + "<br>" +
                    "<b>Event Type:</b> " + d.SUB_EVENT_TYPE + "<br>" +
                    "<b>Fatality</b>: " + d.FATALITIES + "<br>" +
                    "<b>Source:</b> " + d.SOURCE;
                console.log(info1);
                document.getElementById("info").innerHTML = info1;
            }

            function zoomed(event, d) {
                group.attr("transform", event.transform);
                node.attr("transform", event.transform);
            }

        });


    });


};

geo();