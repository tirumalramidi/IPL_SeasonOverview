let newXData = "Average"
let newYData = "Runs"

generateScatterPlot = (data,selectedTeam) => {

    console.log(data)

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

    let body = d3.select('#scatterPlot');

    body.append('span')
        .text('X-Axis Variable: ');

    let xInput = body.append('select')
        .attr('id', 'xspSelect')
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
        .attr('id', 'yspSelect')
        .selectAll('option')
        .data(selectYData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    body.append('br');

    drawScatterPlot("Average", "Runs");

    d3.select('#xspSelect')
        .on('change', function () {

            d3.selectAll("#scatterPlot > svg").remove();

            newXData = d3.select(this).property('value');
            drawScatterPlot(newXData, newYData);
        });

    d3.select('#yspSelect')
        .on('change', function () {

            d3.selectAll("#scatterPlot > svg").remove();

            newYData = d3.select(this).property('value');
            drawScatterPlot(newXData, newYData);
        });

    function drawScatterPlot(xVar, yVar) {

        let tooltip = d3.select('#scatterPlot')
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none')
            .style('opacity', 0);

        let shortNames = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PK", "RCB", "RR", "SRH"]
        let teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
        let teamColors = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

        let varTeam;

        for(let i=0; i<10; i++){
            if(shortNames[i] == selectedTeam){
                varTeam = teamsNames[i]
            }
        }

        console.log(varTeam)

        let margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 30
        }

        width = 750 - margin.left - margin.right;
        height = 600 - margin.top - margin.bottom;

        let xySelect = ["Runs", "Innings", "Matches", "Not Out", "Average", "Balls Faced", "Strike Rate", "Centuries", "Fifties", "Fours", "Sixes"]
        let xyData = ["runs", "batInnings", "batMatches", "notOut", "batAverage", "ballsFaced", "strikeRate", "centuries", "fifties", "fours", "sixes"]

        let varXSelected = 0
        for (let i = 0; i < 11; i++) {
            if (xVar == xySelect[i])
                varXSelected = i
        }

        let varYSelected = 1
        for (let i = 0; i < 11; i++) {
            if (yVar == xySelect[i])
                varYSelected = i
        }

        let svg = d3.select("#scatterPlot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let xScale = d3.scaleLinear()
            .domain([0, d3.max(
                data.map(
                    d => d[xyData[varXSelected]]
                )
            )])
            .range([0, width]);

        let xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .style("font-size", "12px");

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(
                data.map(d => d[xyData[varYSelected]])
            )])
            .range([height, 0]);

        let yAxis = svg.append("g")
            .call(d3.axisLeft(yScale))
            .style("font-size", "12px");

        let color = d3.scaleOrdinal()
            .domain(teamsNames)
            .range(teamColors);

        let xSvg = svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            // .transition()
            // .duration(20)
            .attr("cx", function (d) {
                //console.log("X",d[xyData[varXSelected]])
                return (xScale(d[xyData[varXSelected]]) == '' || isNaN(xScale(d[xyData[varXSelected]]))) ? null : xScale(d[xyData[varXSelected]]);
            })
            // .transition()
            // .duration(2000)
            .attr("cy", function (d) {
                //console.log("Y",d[xyData[varYSelected]])
                return (yScale(d[xyData[varYSelected]]) == '' || isNaN(yScale(d[xyData[varYSelected]]))) ?  null : yScale(d[xyData[varYSelected]]);
            })
            .attr("r", 6.0)
            .style("fill", function (d) { return color(d['team']) })
            .style('stroke', 'black')
            .style('opacity', 0);


            xSvg.transition()
            .duration( function(d){
                if(selectedTeam == 'none')
                    return 2000
                if(d.team == varTeam && varTeam != 'none')
                    return 200
                else
                    return 200 })
            .delay(function(d,i){ 
                if(selectedTeam == 'none')
                    return i * (20 / 4)
                if(d.team == varTeam && varTeam != 'none')
                    return 0
                else
                    return 0 })
            .style('opacity', function (d) { 
                if(selectedTeam == 'none')
                    return 1
                if(d.team == varTeam && varTeam != 'none')
                    return 1
                else
                    return 0.2 });
            
            xSvg.on("mouseover", function (event, d) {
                let varColor = ''
                for (let i = 0; i < 10; i++) {
                    if (teamsNames[i] == d.team) {
                        varColor = teamColors[i]
                    }
                }
                tooltip.text("");
                tooltip.style("display", "block")
                    .transition().duration(200)
                    .style("opacity", 0.75);
                tooltip.style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 100) + 'px');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text('Player: ');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(d.player)
                    .style('color', '#996600');
                tooltip.append('br');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text('Team: ');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(d.team)
                    .style('color', '#996600');
                //.style('color', varColor);
                tooltip.append('br');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(xySelect[varXSelected] + ': ');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(d[xyData[varXSelected]])
                    .style('color', '#996600');
                tooltip.append('br');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(xySelect[varYSelected] + ': ');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(d[xyData[varYSelected]])
                    .style('color', '#996600');
            })
            .on('mouseout', () => {
                tooltip.transition()
                    .duration(500)
                    .on('end', () => tooltip.style('display', 'none'))
                    .style('opacity', 0);
            });
    }
}