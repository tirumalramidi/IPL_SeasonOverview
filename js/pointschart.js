generatePoints = (data) => {

    console.log(data)

    var smargin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - smargin.left - smargin.right,
        height = 600 - smargin.top - smargin.bottom;

    var svg = d3.select("#pointsHistory")
        .append("svg")
        .attr("width", width + smargin.left + smargin.right)
        .attr("height", height + smargin.top + smargin.bottom)
        .append("g")
        .attr("transform", "translate(" + smargin.left + "," + smargin.top + ")");

    var sumstat = d3.nest()
        .key(function (d) { return d.Teams; })
        .entries(data);

    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.Matches; }))
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    var y = d3.scaleLinear()
        .domain([d3.max(data, function (d) { return +d.Position; }), 1])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    var res = sumstat.map(function (d) { return d.key })

    var color = d3.scaleOrdinal()
        .domain(res)
        .range(["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#FFD700", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"])

    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(+d.Matches); })
                .y(function (d) { return y(+d.Position); })
                (d.values)
        })
        .attr("stroke-width", "2.5px");
}