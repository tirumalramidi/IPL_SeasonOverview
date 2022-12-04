let matchSelected

generatePoints = (data, data2, selectedTeam, pointsArray) => {

    let selectData = [
        { "text": "Position" },
        { "text": "Wins" },
        { "text": "Losses" },
        { "text": "Net Run Rate" }
    ]

    let body = d3.select('#pointsHistory')

    let tooltip = d3.select('#pointsHistory')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
        .style('opacity', 0);

    var span = body.append('span')
        .text('What to display on Y-Axis: ')

    var xInput = body.append('select')
        .attr('id', 'xpSelect')
        .selectAll('option')
        .data(selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    body.append('br')
    body.append('br')

    let newData = 'Position'

    drawPointsChart(newData);

    d3.select('#xpSelect')
        .on('change', function () {

            d3.selectAll("#pointsHistory > svg").remove();

            newData = d3.select(this).property('value');
            drawPointsChart(newData);
        });

    function drawPointsChart(variable) {

        let tooltip = d3.select('#pointsHistory')
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none')
            .style('opacity', 0);

        let xSelectData = ["Position", "Wins", "Losses", "Net Run Rate"]
        let xOrigData = ["Position", "Wins", "Losses", "NRR"]

        let varSelect = -1
        for (let i = 0; i < 4; i++) {
            if (xSelectData[i] == variable)
                varSelect = i
        }

        variable = xOrigData[varSelect]

        let margin = {
            top: 25,
            left: 75,
            right: 25,
            bottom: 75
        }

        let width = 800 - margin.left - margin.right;
        let height = 600 - margin.top - margin.bottom;

        let svg = d3.select("#pointsHistory")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let sumstat = d3.nest()
            .key(function (d) { return d.Teams; })
            .entries(data);

        let x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return +d.Matches; }))
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(10))
            .style("font-size", "12px");

        let y;

        if (variable == 'Position') {
            y = d3.scaleLinear()
                .domain([d3.max(data, function (d) { return +d.Position; }), 1])
                .range([height, 0]);
        }
        else if (variable == 'Wins') {
            y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.Wins; })])
                .range([height, 0]);
        }
        else if (variable == 'Losses') {
            y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.Losses; })])
                .range([height, 0]);
        }
        else if (variable == 'NRR') {
            y = d3.scaleLinear()
                .domain([d3.min(data, function (d) { return +d.NRR; }), d3.max(data, function (d) { return +d.NRR; })])
                .range([height, 0]);
        }

        svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", "12px");

        let res = sumstat.map(function (d) { return d.key })

        let color = d3.scaleOrdinal()
            .domain(res)
            .range(["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#FFD700", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"])

        let lines = svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) {
                if (selectedTeam.length == 0)
                    return color(d.key)
                if (selectedTeam.length != 0 && selectedTeam.indexOf(d.key) > -1)
                    return color(d.key)
                else {
                    return 'gray'
                }
            })
            .attr("d", function (d) {
                if (varSelect == -1) {
                    return d3.line()
                        .x(function (d) { return x(+d["Matches"]); })
                        .y(function (d) { return y(+d["Position"]); })
                        (d.values)
                }
                else {
                    return d3.line()
                        .x(function (d) { return x(+d["Matches"]); })
                        .y(function (d) { return y(+d[xOrigData[varSelect]]); })
                        (d.values)
                }
            })
            .attr("stroke-width", "2.5px")
            .style('opacity', function (d) {
                if (selectedTeam.length == 0)
                    return 1
                if (selectedTeam.length != 0 && selectedTeam.indexOf(d.key) > -1)
                    return 1
                else {
                    return 0.2
                }
            })

        lines.on("mouseover", function (event, d) {

            if (selectedTeam.length == 0) {
                d3.selectAll('path')
                    .attr('stroke', 'gray')
                    .attr('opacity', 0.2);

                d3.select(this)
                    .attr('stroke', color(d.key))
                    .attr('opacity', 1);
            }

            let shortNames = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PK", "RCB", "RR", "SRH"]
            let teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
            let homeStadiums = ["M.A.Chidambaram Stadium", "Arun Jaitley Ground", "NA", "Eden Gardens", "NA", "Wankhede Stadium", "PCA Stadium", "M.Chinnaswamy Stadium", "Sawai Mansingh Stadium", "Rajiv Gandhi International Cricket Stadium"]
            let yearFounded = ["2008", "2008", "2021", "2008", "2021", "2008", "2008", "2008", "2008", "2012"]
            let trophiesWon = ["4", "0", "1", "2", "0", "5", "0", "0", "1", "2"]
            let fansWorldwide = ["32.8M", "13.8M", "2.6M", "25.1M", "2M", "32.2M", "14.2M", "25.7M", "10.2M", "12.2M"]
            let promPlayer = ["MS Dhoni", "Virender Sehwag", "Hardik Pandya", "Gautham Gambhir", "KL Rahul", "Rohit Sharma", "Yuvraj Singh", "Virat Kohli", "Shane Warne", "David Warner"]

            for (let i = 0; i < 10; i++) {
                if (d.key == shortNames[i]) {
                    varTeam = teamsNames[i]
                    home = homeStadiums[i]
                    year = yearFounded[i]
                    trophies = trophiesWon[i]
                    fans = fansWorldwide[i]
                    prom = promPlayer[i]
                }
            }

            tooltip.text("");
            tooltip.style("display", "block")
                .transition().duration(200)
                .style("opacity", 0.75);
            tooltip.style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 137) + 'px');

            tooltip.append('span')
                .classed('tooltip-text', true)
                .text('Team: ')
                .style('color', '#2A6592');
            tooltip.append('span')
                .classed('tooltip-text', true)
                .text(varTeam)
                .style('color', '#996600');
            tooltip.append('br')

            tooltip.append('span')
                .classed('tooltip-text', true)
                .text('Home Stadium: ')
                .style('color', '#2A6592');
            tooltip.append('span')
                .classed('tooltip-text', true)
                .text(home)
                .style('color', '#996600');
            tooltip.append('br')

            tooltip.append('span')
                .classed('tooltip-text', true)
                .text('Team Founded in: ')
                .style('color', '#2A6592');
            tooltip.append('span')
                .classed('tooltip-text', true)
                .text(year)
                .style('color', '#996600');
            tooltip.append('br')

            tooltip.append('span')
                .classed('tooltip-text', true)
                .text('Number of Trophies: ')
                .style('color', '#2A6592');
            tooltip.append('span')
                .classed('tooltip-text', true)
                .text(trophies)
                .style('color', '#996600');
            tooltip.append('br')

            tooltip.append('span')
                .classed('tooltip-text', true)
                .text('Most Prominent Player in History: ')
                .style('color', '#2A6592');
            tooltip.append('span')
                .classed('tooltip-text', true)
                .text(prom)
                .style('color', '#996600');
            tooltip.append('br')

            tooltip.append('span')
                .classed('tooltip-text', true)
                .text('Fans Worldwide: ')
                .style('color', '#2A6592');
            tooltip.append('span')
                .classed('tooltip-text', true)
                .text(fans)
                .style('color', '#996600');
            tooltip.append('br')
        })
            .on("mouseout", function (d, i) {

                if (selectedTeam.length == 0) {
                    d3.selectAll('path')
                        .attr("stroke", function (d) {
                            if (d != null)
                                return color(d.key);
                        })
                        .attr('opacity', 1)
                }

                tooltip.transition()
                    .duration(500)
                    .on('end', () => tooltip.style('display', 'none'))
                    .style('opacity', 0);
            });

        svg.selectAll("myCircles")
            .data(pointsArray)
            .enter()
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", function (d, i) {
                if (d['Team'] == 'MI')
                    return x(+d["Match"])
                if (d['Team'] == 'CSK')
                    return x(+d["Match"])
                if (d['Team'] == 'KKR')
                    return x(+d["Match"])
                if (d['Team'] == 'GT')
                    return x(+d["Match"])
                if (d['Team'] == 'PK')
                    return x(+d["Match"])
                if (d['Team'] == 'RCB')
                    return x(+d["Match"])
                if (d['Team'] == 'DC')
                    return x(+d["Match"])
                if (d['Team'] == 'SRH')
                    return x(+d["Match"])
                if (d['Team'] == 'RR')
                    return x(+d["Match"])
                if (d['Team'] == 'LSG')
                    return x(+d["Match"])
            })
            .attr("cy", function (d) {
                if (d['Team'] == 'MI')
                    return y(+d[variable])
                if (d['Team'] == 'CSK')
                    return y(+d[variable])
                if (d['Team'] == 'KKR')
                    return y(+d[variable])
                if (d['Team'] == 'GT')
                    return y(+d[variable])
                if (d['Team'] == 'PK')
                    return y(+d[variable])
                if (d['Team'] == 'RCB')
                    return y(+d[variable])
                if (d['Team'] == 'DC')
                    return y(+d[variable])
                if (d['Team'] == 'SRH')
                    return y(+d[variable])
                if (d['Team'] == 'RR')
                    return y(+d[variable])
                if (d['Team'] == 'LSG')
                    return y(+d[variable])
            })
            .attr("r", 5)
            .attr('opacity', 0.7)
            .on('mousedown', function (d, i) {
                matchSelected = i['Match']
                d3.selectAll("#scorecard > svg").remove();
                d3.selectAll("#scorecard > select").remove();
                d3.selectAll("#scorecard > span").remove();
                d3.selectAll("#scorecard > br").remove();
                render(data2)
            });

        svg.append("text")
            .attr("x", 300)
            .attr("y", 540)
            .attr("class", "title")
            .text("Match");

        svg.append("text")
            .attr("x", -300)
            .attr("y", -40)
            .attr('transform', 'rotate(-90)')
            .attr("class", "label")
            .text(newData);
    }
}