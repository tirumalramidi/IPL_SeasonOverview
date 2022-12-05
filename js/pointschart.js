let matchSelected
let nodeSelected = 'false'

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
            .transition()
            .duration(3000)
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
            .transition()
            .duration(3000)
            .call(d3.axisLeft(y))
            .style("font-size", "12px");

        let res = sumstat.map(function (d) { return d.key })

        let color = d3.scaleOrdinal()
            .domain(res)
            .range(["#FFFF00", "#191970", "#87CEEB", "#8B008B", "#00FFFF", "#0000FF", "#8B0000", "#ADFF2F", "#FF1493", "#FF8C00"])

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
            .call(transition)
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

        lines.on("mouseover", function (event, id) {

            if (selectedTeam.length == 0) {
                svg.selectAll('path')
                    .attr('stroke', 'gray')
                    .attr('opacity', 0.2);

                d3.select(this)
                    .attr('stroke', color(id.key))
                    .attr('opacity', 1);

                svg.selectAll('circle')
                    .attr('stroke', function (d) {
                        if (d != null)
                            return id.key == d['Team'] ? 'red' : 'gray'
                    })
                    .attr('opacity', function (d) {
                        if (d != null)
                            return id.key == d['Team'] ? 1 : 0.2
                    });
            }

            let shortNames = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PK", "RCB", "RR", "SRH"]
            let teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]

            for (let i = 0; i < 10; i++) {
                if (id.key == shortNames[i]) {
                    varTeam = teamsNames[i]
                }
            }

            tooltip.text("");
            tooltip.style("display", "block")
                .transition().duration(200)
                .style("opacity", 0.9);
            tooltip.style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 33) + 'px');

            tooltip.append('span')
                .classed('tooltip-text', true)
                .text('Team: ')
                .style('color', '#2A6592');
            tooltip.append('span')
                .classed('tooltip-text', true)
                .text(varTeam)
                .style('color', '#996600');
            tooltip.append('br')
        })
            .on("mouseout", function (d, i) {

                if (selectedTeam.length == 0) {
                    svg.selectAll('path')
                        .attr("stroke", function (d) {
                            if (d != null)
                                return color(d.key);
                        })
                        .attr('opacity', 1)

                    svg.selectAll('circle')
                        .attr('stroke', 'red')
                        .attr('opacity', 0.7)
                        .attr("r", 5);
                }

                tooltip.transition()
                    .duration(500)
                    .on('end', () => tooltip.style('display', 'none'))
                    .style('opacity', 0);

            });

        let circles = svg.selectAll("myCircles")
            .data(pointsArray)
            .enter()
            .append("circle")
            .attr("fill", function (d) {
                if (selectedTeam.length == 0)
                    return 'red'
                if (selectedTeam.length != 0 && selectedTeam.indexOf(d['Team']) > -1)
                    return 'red'
                else {
                    return 'gray'
                }
            })
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

        circles.transition()
            .duration(6000)
            .attr('opacity', function (d) {
                if (selectedTeam.length == 0)
                    return 0.7
                if (selectedTeam.length != 0 && selectedTeam.indexOf(d['Team']) > -1)
                    return 0.7
                else {
                    return 0.2
                }
            })

        circles.on('mouseover', function (event, i) {
            if (selectedTeam.length == 0) {
                svg.selectAll('circle')
                    .attr('stroke', 'gray')
                    .attr('opacity', 0.2);

                d3.select(this)
                    .attr('stroke', 'red')
                    .attr('opacity', 0.7)
                    .attr("r", 8);
                svg.selectAll('path')
                    .attr('stroke', function (d) {
                        if (d != null)
                            return d.key == i['Team'] ? color(d.key) : 'gray'
                    })
                    .attr('opacity', function (d) {
                        if (d != null)
                            return d.key == i['Team'] ? 1 : 0.2
                    });
            }


        }).on('mouseout', function (event, d) {
            if (selectedTeam.length == 0) {
                svg.selectAll('circle')
                    .attr('stroke', 'red')
                    .attr('opacity', 0.7)
                    .attr("r", 5);
                    
                svg.selectAll('path')
                    .attr('stroke', function (d) {
                        if (d != null)
                            return color(d.key)
                    })
                    .attr('opacity', 1)
            }
        })
            .on('mousedown', function (d, i) {

                svg.selectAll('circle')
                    .attr('stroke', 'gray')
                    .attr('opacity', 0.2);

                d3.select(this)
                    .attr('stroke', 'red')
                    .attr('opacity', 0.7)
                    .attr("r", 8);

                matchSelected = i['Match']

                let teamOneMatchName = data2[matchSelected]['teamOne']

                let teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
                let homeStadiums = ["M.A.Chidambaram Stadium", "Arun Jaitley Ground", "Narendra Modi Stadium", "Eden Gardens", "Shri Atal Bihari Vajpayee Ekana Cricket Stadium", "Wankhede Stadium", "PCA Stadium", "M.Chinnaswamy Stadium", "Sawai Mansingh Stadium", "Rajiv Gandhi International Cricket Stadium"]
                let attendanceStadiums = ["48193", "32398", "38172", "42664", "34584", "52348", "30774", "45636", "34963", "44182"]

                let totalRuns = 0
                let totalWickets = 0
                let totalExtras = 0

                for (let i = 0; i < 20; i++) {
                    totalRuns = totalRuns + data2[matchSelected]['matchScorecard'][i]['totalRunsOne'] + data2[matchSelected]['matchScorecard'][i]['totalRunsTwo']
                    totalWickets = totalWickets + data2[matchSelected]['matchScorecard'][i]['wicketsOne'] + data2[matchSelected]['matchScorecard'][i]['wicketsTwo']
                    totalExtras = totalExtras + data2[matchSelected]['matchScorecard'][i]['extraRunsOne'] + data2[matchSelected]['matchScorecard'][i]['extraRunsOne']
                }

                for (let i = 0; i < 10; i++) {
                    if (teamOneMatchName == teamsNames[i]) {
                        home = homeStadiums[i]
                        attendance = attendanceStadiums[i]
                    }
                }

                let iplData = document.querySelectorAll("h5")

                iplData[5].innerText = "Venue: " + home
                iplData[6].innerText = "Attendance: " + attendance
                iplData[7].innerText = "Total Runs Scored: " + totalRuns
                iplData[8].innerText = "Total Wickets Taken: " + totalWickets
                iplData[9].innerText = "Total Extras: " + totalExtras

                d3.selectAll("#scorecard > svg").remove();
                d3.selectAll("#scorecard > select").remove();
                d3.selectAll("#scorecard > span").remove();
                d3.selectAll("#scorecard > br").remove();
                generateScorecard(data2)
            });

        function tweenDash() {
            const l = this.getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
            return function (t) { return i(t) };
        }
        function transition(path) {
            path.transition()
                .duration(3500)
                .attrTween("stroke-dasharray", tweenDash)
                .on("end", () => { d3.select(this).call(transition); });
        }

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
