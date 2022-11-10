generateScatterPlot = (data) => {

    teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
    teamColors = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

    let margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 30
    }

    width = 700 - margin.left - margin.right;
    height = 600 - margin.top - margin.bottom;

    let svg = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear()
        .domain([0, d3.max(
            data.map(
                d => d["batAverage"]
            )
        )])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .style("font-size", "12px");

    let y = d3.scaleLinear()
        .domain([0, d3.max(
            data.map(d => d["runs"])
        )])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "12px");

    let color = d3.scaleOrdinal()
        .domain(teamsNames)
        .range(teamColors);

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d["batAverage"]) != '' ? x(d["batAverage"]) : 0;
        })
        .attr("cy", function (d) {
            return y(d["batAverage"]) != '' ? y(d["runs"]) : 0;
        })
        .attr("r", 6.0)
        .style("fill", function (d) { return color(d['team']) })
        .style('stroke', 'black');
}