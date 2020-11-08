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
        .attr("viewBox", "0 0 900 800")
        .attr("preserveAspectRatio", "xMidYMid meet");

    svg.style("overflow", "hidden")
        .style("z-index", 0)

    d3.csv("data/acled.csv").then(function (data) {

        var projection = d3.geoMercator()
            .scale(300)

        var path = d3.geoPath()
            .projection(projection);

        d3.json("data/us_cities.geojson").then(function (swiss) {
            
            //var cantons = topojson.feature(swiss, swiss);

            var group = svg.selectAll("g")
                .data(swiss.features)
                .enter()
                .append("g");

            //            svg.selectAll(".pin")
            //                .data(data)
            //                .enter().append("circle", ".pin")
            //                .attr("r", 5)
            //                .attr("transform", function (d) {
            //                    return "translate(" + projection([
            //							  d.location.longitude,
            //							  d.location.latitude
            //							]) + ")";
            //                })
            //                .on('mouseover', tip.show)
            //                .on('click', tip.hide);

            //var projection = d3.geo.mercator().scale(900).translate([-600,700]);



            var path = d3.geoPath().projection(projection);
            
            var areas = group.append("path")
                .attr("d", path)
                .attr("fill", "pink");

        });


    });
}

geo();
