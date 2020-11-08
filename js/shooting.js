function shooting() { // hi this is lucy

    var width = 20000,
        height = document.getElementById("shooting").offsetHeight,
        margin = 50;

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

        })

        console.log(race);

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .range([margin, width - margin]);
        
        let raceScale = d3.scaleOrdinal()
        .domain["A", "W", "H", "B", "O", "", "N"]
        .range["yellow","pink","brown",]


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
                return "red";
            })

    });
};

shooting();
