function fulltimeline() { // hi this is lucy

    var width = document.getElementById("fulltimeline").offsetWidth,
        height = document.getElementById("fulltimeline").offsetHeight,
        margin = 50;

    var parseTime = d3.timeParse("%Y%m%d");

    var svg = d3.select("#fulltimeline")
        .attr("class", "timline")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svg.style("overflow", "hidden")
        .style("z-index", 0)


    d3.csv("../data/ssp_simplified.csv").then(function (data) {

        let actions = [],
            countries = [];

        data.forEach(function (d) {
            if (actions.includes(d.action) == false) {
                actions.push(d.action);
            }
            if (countries.includes(d.country_name) == false) {
                countries.push(d.country_name);
            }
        });

        console.log(countries);

        data = data.filter(function (d) {
            return d.date_text.includes("unknown") == false &&
                d.country_name == "United States" &&
                d.initiator.includes("unknown") == false;
        })

        var actionScale = d3.scaleOrdinal()
            .domain(actions)
            .range(d3.schemeSet3);

        var timeScale = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return parseTime(+d.date);
            }))
            .range([margin, width - margin]);

        var violenceScale = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return d.violence_policeorstate;
            }))
            .range([2, 7]);

        var xaxistext = svg.append("text")
            .attr("class", "xaxistext")
            .attr("x", width - margin / 2)
            .attr("y", height - margin / 2)
            .text("Timeline")
            .style("text-anchor", "end")
            .style("fill", "#bcbcbc");

        var xaxis = svg.append("g")
            .attr("class", "yipxaxis")
            .attr("transform", "translate(0," + height * 0.8 + ")")
            .call(d3.axisBottom(timeScale))
            .style("opacity", 0)
            .transition()
            .delay(3000)
            .style("opacity", 1);

        xaxis.transition().selectAll(".yipxaxis line")
            .style("stroke-width", 0.1)
            .style("stroke", "#bcbcbc")
            .style("stroke-dasharray", "1,5")
            .attr("y1", -5)
            .attr("y2", -height * 0.3);

        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return d.eventid;
            })
            .attr("r", function (d) {
                return violenceScale(d.violence_policeorstate);
            })
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", function (d) {
                return actionScale(d.action);
            })

        var simulation = d3.forceSimulation()
            .force("x",
                d3.forceX()
                .strength(0.8)
                .x(function (d) {
                    return timeScale(parseTime(+d.date));
                }))
            .force("y",
                d3.forceY()
                .strength(0.1)
                .y(height / 2))
            .force("charge", d3.forceManyBody().strength(0.8))
            .force("collide", d3.forceCollide().strength(1)
                .radius(function (d) {
                    return violenceScale(d.violence_policeorstate) + 1;
                })
                .iterations(2))

        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
            });

        node.on("mouseover", function (event, d) {
            console.log(d.location);
            console.log(d);
        })

    });

};

fulltimeline();
noLoop();
//$(window).scroll(function () {
//    showfulltimeline();
//});
//
//function showfulltimeline() {
//    var hT = $('#fulltimeline').offset().top,
//        hH = $('#fulltimeline').outerHeight(),
//        wH = $(window).height(),
//        wS = $(this).scrollTop();
//    if (wS > (hT + hH - wH)) {
//        showfulltimeline = noop;
//        //console.log("triggered full timeline");
//        noLoop();
//        fulltimeline();
//    }
//};
