let newXData = "Batting Average"
let newYData = "Runs Scored"

let fullSelectedTeams = []

generateScatterPlot = (data, selectedTeam) => {

    let selectXData = [
        { "text": "Batting Average" },
        { "text": "Not Out" },
        { "text": "Runs Scored" },
        { "text": "Balls Faced" },
        { "text": "Batting Strike Rate" },
        { "text": "Centuries" },
        { "text": "Fifties" },
        { "text": "Fours Hit" },
        { "text": "Sixes Hit" },
        { "text": "Overs Bowled" },
        { "text": "Runs Conceded" },
        { "text": "Wickets Taken" },
        { "text": "Bowling Average" },
        { "text": "Economy" },
        { "text": "Bowling Strike Rate" },
        { "text": "Fours Given" },
        { "text": "Sixes Given" }
    ]

    let selectYData = [
        { "text": "Runs Scored" },
        { "text": "Batting Average" },
        { "text": "Not Out" },
        { "text": "Balls Faced" },
        { "text": "Batting Strike Rate" },
        { "text": "Centuries" },
        { "text": "Fifties" },
        { "text": "Fours Hit" },
        { "text": "Sixes Hit" },
        { "text": "Overs Bowled" },
        { "text": "Runs Conceded" },
        { "text": "Wickets Taken" },
        { "text": "Bowling Average" },
        { "text": "Economy" },
        { "text": "Bowling Strike Rate" },
        { "text": "Four Wicket Hauls" },
        { "text": "Five Wicket Hauls" }
    ]

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

    drawScatterPlot("Batting Average", "Runs Scored");

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

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (selectedTeam[i] == shortNames[j]) {
                    let findTeam = fullSelectedTeams.find(function (ele) {
                        return ele == teamsNames[j]
                    })

                    if (!findTeam) {
                        fullSelectedTeams.push(teamsNames[j])
                    }
                }
            }
        }

        let margin = {
            top: 25,
            left: 75,
            right: 25,
            bottom: 75
        }

        width = 750 - margin.left - margin.right;
        height = 600 - margin.top - margin.bottom;

        let xySelect = ["Runs Scored", "Not Out", "Batting Average", "Balls Faced", "Batting Strike Rate", "Centuries", "Fifties", "Fours Hit", "Sixes Hit", "Overs Bowled", "Runs Conceded", "Wickets Taken", "Bowling Average", "Economy", "Bowling Strike Rate", "Four Wicket Hauls", "Five Wicket Hauls"]
        let xyData = ["runs", "notOut", "batAverage", "ballsFaced", "strikeRate", "centuries", "fifties", "fours", "sixes", "bowlOvers", "runsGiven", "wicketsTaken", "bowlAverage", "economy", "bowlSR", "fourW", "fiveW"]

        let varXSelected = 0
        for (let i = 0; i < 16; i++) {
            if (xVar == xySelect[i])
                varXSelected = i
        }

        let varYSelected = 1
        for (let i = 0; i < 16; i++) {
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

        let dots = svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return (xScale(d[xyData[varXSelected]]) == '' || isNaN(xScale(d[xyData[varXSelected]]))) ? null : xScale(d[xyData[varXSelected]]);
            })
            .attr("cy", function (d) {
                return (yScale(d[xyData[varYSelected]]) == '' || isNaN(yScale(d[xyData[varYSelected]]))) ? null : yScale(d[xyData[varYSelected]]);
            })
            .attr("r", 6.0)
            .style("fill", function (d) { return color(d['team']) })
            .style('stroke', 'black')
            .style('opacity', 0);

        dots.transition()
            .duration(function (d) {
                if (fullSelectedTeams.length == 0)
                    return 2000
                if (fullSelectedTeams.length != 0 && fullSelectedTeams.indexOf(d.team) > -1)
                    return 200
                else
                    return 200
            })
            .delay(function (d, i) {
                if (fullSelectedTeams.length == 0)
                    return i * (20 / 4)
                if (fullSelectedTeams.length != 0 && fullSelectedTeams.indexOf(d.team) > -1)
                    return 0
                else
                    return 0
            })
            .style('opacity', function (d) {
                if (fullSelectedTeams.length == 0)
                    return 1
                if (fullSelectedTeams.length != 0 && fullSelectedTeams.indexOf(d.team) > -1)
                    return 1
                else {
                    return 0.2
                }
            })
            .style('fill', function (d) {
                if (fullSelectedTeams.length == 0) {
                    return color(d['team'])
                }
                if (fullSelectedTeams.length != 0 && fullSelectedTeams.indexOf(d.team) > -1) {
                    return color(d['team'])
                }
                else {
                    return 'gray'
                }
            });

        dots.on("mouseover", function (event, d) {

            let varColor = ''

            for (let i = 0; i < 10; i++) {
                if (teamsNames[i] == d.team) {
                    varColor = teamColors[i]
                }
            }

            svg.selectAll('circle')
                .style('fill', 'gray')
                .style('opacity', 0.33)

            d3.select(this)
                .style("fill", function (d) { return color(d['team']) })
                .style('opacity', 1)

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
            .on('mouseout', function (event, d) {

                svg.selectAll('circle')
                    .style('fill', function (d) {
                        if (fullSelectedTeams.length == 0) {
                            return color(d['team'])
                        }
                        if (fullSelectedTeams.length != 0 && fullSelectedTeams.indexOf(d.team) > -1) {
                            return color(d['team'])
                        }
                        else {
                            return 'gray'
                        }
                    })
                    .style('opacity', function (d) {
                        if (fullSelectedTeams.length == 0)
                            return 1
                        if (fullSelectedTeams.length != 0 && fullSelectedTeams.indexOf(d.team) > -1)
                            return 1
                        else {
                            return 0.2
                        }
                    });

                tooltip.transition()
                    .duration(500)
                    .on('end', () => tooltip.style('display', 'none'))
                    .style('opacity', 0);
            });

        svg.append("text")
            .attr("x", 250)
            .attr("y", 545)
            .attr("class", "title")
            .text(newXData);

        svg.append("text")
            .attr("x", -300)
            .attr("y", -45)
            .attr('transform', 'rotate(-90)')
            .attr("class", "label")
            .text(newYData);
    }
}