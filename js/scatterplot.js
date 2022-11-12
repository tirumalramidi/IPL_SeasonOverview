generateScatterPlot = (data) => {

    let selectXData = [
        { "text": "Average" },
        { "text": "Innings" },
        { "text": "Matches" },
        { "text": "Not Out" },
        { "text": "Runs" },
        { "text": "Balls Faced" },
        { "text": "Strike Rate" },
        { "text": "Centuries" },
        { "text": "Fifties" },
        { "text": "Fours" },
        { "text": "Sixes" }
    ]

    let selectYData = [
        { "text": "Runs" },
        { "text": "Innings" },
        { "text": "Matches" },
        { "text": "Not Out" },
        { "text": "Average" },
        { "text": "Balls Faced" },
        { "text": "Strike Rate" },
        { "text": "Centuries" },
        { "text": "Fifties" },
        { "text": "Fours" },
        { "text": "Sixes" }
    ]

    let xySelect = ["Runs", "Innings", "Matches", "Not Out", "Average", "Balls Faced", "Strike Rate", "Centuries", "Fifties", "Fours", "Sixes"]
    let xyData = ["runs", "batInnings", "batMatches", "notOut", "batAverage", "ballsFaced", "strikeRate", "centuries", "fifties", "fours", "sixes"]

    let body = d3.select('#scatterPlot')

    body.append('span')
        .text('X-Axis Variable: ')

    let xInput = body.append('select')
        .attr('id', 'xSelect')
        .selectAll('option')
        .data(selectXData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    body.append('br')

    body.append('span')
        .text('Y-Axis Variable: ')

    let yInput = body.append('select')
        .attr('id', 'ySelect')
        .selectAll('option')
        .data(selectYData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    body.append('br')

    let newXData = ""
    let newYData = ""

    d3.select('#xSelect')
        .on('change', function () {

            newXData = d3.select(this).property('value');
        });

    d3.select('#ySelect')
        .on('change', function () {

            newYData = d3.select(this).property('value');
        });

    let teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
    let teamColors = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

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

    let xScale = d3.scaleLinear()
        .domain([0, d3.max(
            data.map(
                d => d["batAverage"]
            )
        )])
        .range([0, width]);

    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .style("font-size", "12px");

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(
            data.map(d => d["runs"])
        )])
        .range([height, 0]);

    let yAxis = svg.append("g")
        .call(d3.axisLeft(yScale))
        .style("font-size", "12px");

    let color = d3.scaleOrdinal()
        .domain(teamsNames)
        .range(teamColors);

    let varXSelected = 0
    for(let i=0; i<11; i++){
        if(newXData == xySelect[i])
            varXSelected = i
    }

    let varYSelected = 1
    for(let i=0; i<11; i++){
        if(newYData == xySelect[i])
            varYSelected = i
    }

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d['batAverage']) != '' ? xScale(d['batAverage']) : 0;
        })
        .attr("cy", function (d) {
            return yScale(d['runs']) != '' ? yScale(d['runs']) : 0;
        })
        .attr("r", 6.0)
        .style("fill", function (d) { return color(d['team']) })
        .style('stroke', 'black');
}