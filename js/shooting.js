function shooting() { // hi this is lucy

    var width = 20000,
        height = document.getElementById("shooting").offsetHeight,
        margin = 10;

    var parseTime = d3.timeParse("%Y-%m-%d");

    var tooltip = d3.select("#shooting")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    var svg = d3.select("#shooting")
        .attr("class", "shooting")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svg.style("overflow", "hidden")
        .style("z-index", 0)

    d3.csv("data/police_fatal.csv").then(function (data) {

        var race = [],
            date = 0,
            day_count = 0;

        data.forEach(function (d) {

            if (race.includes(d.race) == false) {
                race.push(d.race);
            }

            if (d.date !== date) {
                date = d.date;
                day_count = 0;
            } else {
                day_count++;
            }

            d.day_count = day_count;
            d.date = parseTime(d.date);

        });

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .range([margin, width - margin]);

        let raceScale = d3.scaleOrdinal()
            .domain(["A", "W", "H", "B", "O", "", "N"])
            .range(["#D5C5C8", "#9DA3A4", "#604D53", "#54001c", "#DB7F8E", "#FFDBDA", "#FFB4A2"]);

        //        svg.append("rect")
        //            .attr("x", 0)
        //            .attr("y", height / 2 - 100)
        //            .attr("width", width)
        //            .attr("height", 120)
        //            .style("fill", "gray")
        //            .style("opacity", 1)

        //        var xaxistext = svg.append("text")
        //            .attr("class", "xaxistext")
        //            .attr("x", width - margin / 2)
        //            .attr("y", height - margin / 2)
        //            .text("Timeline")
        //            .style("text-anchor", "end")
        //            .style("fill", "#bcbcbc");


        var xaxis = svg.append("g")
            .attr("class", "ylxaxis")
            .attr("transform", "translate(0," + (height / 2 + 10) + ")")
            .call(d3.axisBottom(xScale)
                .ticks(50, "%Y-%m-%d"))
            .style("opacity", 0)
            .transition()
            .style("opacity", 1);

        let fatal = svg.append("g")
            .selectAll(".shootingscroll")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "shootingscroll")
            .attr("cx", function (d) {
                return xScale(d.date);
            })
            .attr("cy", function (d) {
                return height / 2 - d.day_count * 10;
            })
            .attr("r", 3)
            .style("fill", function (d) {
                return raceScale(d.race);
            })
            .on("mouseover", function (event, d) {
                let tip = "<svg height='10' width='20'><polygon class='tip' points='10,0,20,10,0,10'/></svg>";
                tooltip
                    .html("<div class='tipp'><div class='tip'>" + tip + "<p class='tooltiptext'>"+"Name: " + d.name + "<br>" + "Race: " + d.race + "<br>" + "Manner of Death: " + d.manner_of_death + "<br>" + "Reason: He or she had "+ d.armed)
                    .style("top", (+this.attributes.cy.value + 30) + "px")
                    .style("left", (+this.attributes.cx.value - 100) + "px")
                    .transition()
                    .style("opacity", 1);
            })
            .on("mouseleave",  function (event, d) {tooltip.transition().style("opacity", 0).transition().style("top", 0 + "px")})


    });
};
