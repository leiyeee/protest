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

        data = data.filter(function (d) {
            return d.date_text.includes("unknown") == false &&
                d.country_name == "United States" &&
                d.initiator.includes("unknown") == false;
        })
        //console.log(data.length)

        var timeScale = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return parseTime(+d.date);
            }))
            .range([margin, width - margin]);

        var violenceScale = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return d.violence_policeorstate;
            }))
            .range([1, 5]);

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
            .style("fill", "pink")

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
            console.log(d);
        })

    });

};

fulltimeline();
