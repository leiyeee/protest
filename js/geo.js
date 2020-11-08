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
        .attr("width", width)
        .attr("height", height)

    svg.style("overflow", "hidden")
        .style("z-index", 0)


    d3.csv("data/acled.csv").then(function (data) {
        
        data.forEach(function (d) {})

        var color = d3.scale.ordinal()
            .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
            .range(colorbrewer.Oranges[9]);

        /*var projection = d3.geo.mercator()
            .scale(800)
            .translate([-500,600]);*/

        var projection = d3.geo.mercator().scale(1100).translate([-1000, 800]);
        var path = d3.geo.path()
            .projection(projection);

        var svg = d3.select("#map").append("svg")
            .attr("viewBox", "0 0 900 800")
            .attr("preserveAspectRatio", "xMidYMid meet");
        var data;
        
        d3.json("data/test.json", function (error, swiss) {
            if (error) throw error;

            var cantons = topojson.feature(swiss, swiss.objects.india);

            //svg.call(tip);
            var group = svg.selectAll("g")
                .data(cantons.features)
                .enter()
                .append("g");
            //.on('mouseover', tip.show)
            //.on('mouseout', tip.hide)


            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-5, 0])
                .style("left", "300px")
                .style("top", "400px")
                .html(function (d) {
                    return ("<a href=" + d.nam + " target='_blank'>" + d.name + "</a>");
                })

            svg.call(tip);


            svg.selectAll(".pin")
                .data(places)
                .enter().append("circle", ".pin")
                .attr("r", 5)
                .attr("transform", function (d) {
                    return "translate(" + projection([
							  d.location.longitude,
							  d.location.latitude
							]) + ")";
                })
                .on('mouseover', tip.show)
                .on('click', tip.hide);

            //var projection = d3.geo.mercator().scale(900).translate([-600,700]);
            var path = d3.geo.path().projection(projection);

            var areas = group.append("path")
                .attr("d", path)
                .attr("class", "area")
                .attr("fill", "steelblue");

        });


    });
}

geo();
