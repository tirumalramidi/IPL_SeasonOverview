let match = "74"

render = (data2) => {

    let selectSCData = [
        { "text": "Default" },
        { "text": "Final" },
        { "text": "Qualifier 2" },
        { "text": "Eliminator" },
        { "text": "Qualifier 1" }
    ]

    let body = d3.select('#scorecard');

    body.append('span')
        .text('Select Match: ');

    body.append('select')
        .attr('id', 'xscSelect')
        .selectAll('option')
        .data(selectSCData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    body.append('br')

    if (matchSelected != null) {
        match = matchSelected
    }

    d3.select('#xscSelect')
        .on('change', function () {

            d3.selectAll("#scorecard > svg").remove();

            match = d3.select(this).property('value');

            if(match == "Default"){
                match = "73"
            }
            else if (match == "Final") {
                match = "73"
            }
            else if (match == "Qualifier 2") {
                match = "72"
            }
            else if (match == "Eliminator") {
                match = "71"
            }
            else if (match == "Qualifier 1") {
                match = "70"
            }

            playoffsMatch = +match

            let teamOneMatchName = data2[playoffsMatch]['teamOne']

            let shortNames = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PK", "RCB", "RR", "SRH"]
            let teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
            let homeStadiums = ["M.A.Chidambaram Stadium", "Arun Jaitley Ground", "Narendra Modi Stadium", "Eden Gardens", "Shri Atal Bihari Vajpayee Ekana Cricket Stadium", "Wankhede Stadium", "PCA Stadium", "M.Chinnaswamy Stadium", "Sawai Mansingh Stadium", "Rajiv Gandhi International Cricket Stadium"]
            let attendanceStadiums = ["48193", "32398", "38172", "42664", "34584", "52348", "30774", "45636", "34963", "44182"]

            let totalRuns = 0
            let totalWickets = 0
            let totalExtras = 0

            for (let i = 0; i < 20; i++) {
                totalRuns = totalRuns + data2[playoffsMatch]['matchScorecard'][i]['totalRunsOne'] + data2[playoffsMatch]['matchScorecard'][i]['totalRunsTwo']
                totalWickets = totalWickets + data2[playoffsMatch]['matchScorecard'][i]['wicketsOne'] + data2[playoffsMatch]['matchScorecard'][i]['wicketsTwo']
                totalExtras = totalExtras + data2[playoffsMatch]['matchScorecard'][i]['extraRunsOne'] + data2[playoffsMatch]['matchScorecard'][i]['extraRunsOne']
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

            drawScorecard(match);
        });

    drawScorecard(`${match - 1}`);

    function drawScorecard(match) {

        let teamOneName = data2[match]['teamOne']
        let teamTwoName = data2[match]['teamTwo']

        let teamNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Gaints", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
        let teamColor = ["#FFFF00", "#191970", "#87CEEB", "#8B008B", "#00FFFF", "#0000FF", "#8B0000", "#ADFF2F", "#FF1493", "#FF8C00"]

        let teamOneColor = '#FF1493'
        let teamTwoColor = '#87CEEB'

        for (let i = 0; i < 10; i++) {
            if (teamNames[i] == teamOneName) {
                teamOneColor = teamColor[i]
            }
        }

        for (let i = 0; i < 10; i++) {
            if (teamNames[i] == teamTwoName) {
                teamTwoColor = teamColor[i]
            }
        }

        let width = 600
        let height = 600
        let labelArea = 100

        margin = {
            top: 25,
            left: 25,
            right: 25,
            bottom: 75
        };

        let teamOneMaxRuns = d3.max(data2[match]['matchScorecard'].map(d => d["totalRunsOne"]));
        let teamTwoMaxRuns = d3.max(data2[match]['matchScorecard'].map(d => d["totalRunsTwo"]));

        let runsDomain = Math.ceil((d3.max([teamOneMaxRuns, teamTwoMaxRuns])) / 5) * 5;

        let tooltip = d3.select('#scorecard')
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none')
            .style('opacity', 0);

        const x = d3.scaleLinear()
            .domain([-runsDomain, runsDomain])
            .range([0, width + labelArea]);

        const y = d3.scaleBand()
            .domain(data2[match]['matchScorecard'].map(d => d['over']))
            .range([0, height])
            .padding(0.1);

        const svg = d3.select('#scorecard')
            .append('svg')
            .attr('width', width + margin.left + margin.right + labelArea)
            .attr('height', height + margin.top + margin.bottom);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.right})`);

        const barGroups = g.selectAll('.barGroup')
            .data(data2[match]['matchScorecard']);

        barGroups.exit().remove();

        const newBarGroups = barGroups.enter()
            .append('g')
            .attr('class', 'barGroup');

        newBarGroups.append('rect')
            .attr('class', 'positive')
            .attr('fill', teamOneColor);

        newBarGroups.append('rect')
            .attr('class', 'negative')
            .attr('fill', teamTwoColor);

        newBarGroups.merge(barGroups)
            .select('.positive')
            .datum(d => ({
                name: d['over'],
                value: d["totalRunsOne"],
                team: data2[match]['teamOne']
            }));

        newBarGroups.merge(barGroups)
            .select('.negative')
            .datum(d => ({
                name: d['over'],
                value: -parseInt(d["totalRunsTwo"]),
                team: data2[match]['teamTwo']
            }));

        svg.selectAll("text.name")
            .data(data2[match]['matchScorecard'])
            .enter()
            .append("text")
            .attr("x", (labelArea) + width / 2 - 75)
            .attr("y", function (d) {
                return y(d['over']) + y.bandwidth();
            })
            .attr('transform', `translate(50, 10)`)
            .attr("dy", ".20em")
            .attr("text-anchor", "middle")
            .attr('class', 'name')
            .text(function (d) { return +d['over'] + 1; });

        let rectangles = newBarGroups.selectAll('rect')
        .attr('width', d => {
            return d.team == data2[match]['teamOne'] ? x(d.value) - x(0) : x(0) - x(d.value)
        })
        .attr('height', y.bandwidth())
        .attr('y', d => y(d.name))
        rectangles
        .transition()
        .duration(2000)
        .attr('x', d => d.team == data2[match]['teamOne'] ? x(0) + labelArea / 2 : x(d.value) - labelArea / 2)

        rectangles.on("mouseover", function (event, d) {

                d3.selectAll('rect')
                    .style('opacity', 0.33)

                d3.select(this)
                    .style('opacity', 1)

                let teamOne = data2[match]['teamOne'];

                let overNum = d['name']
                let teamName = d['team']

                let defMatch = data2[match]['matchScorecard']

                let batsmanOneNumber = Object.keys(defMatch[overNum]['batsmanOne']).length
                let batsmanTwoNumber = Object.keys(defMatch[overNum]['batsmanTwo']).length

                let numberWickets;

                if (teamName == teamOne) {
                    numberWickets = defMatch[overNum]['wicketsOne']
                }
                else {
                    numberWickets = defMatch[overNum]['wicketsTwo']
                }

                tooltip.text("");
                tooltip.style("display", "block")
                    .transition().duration(200)
                    .style("opacity", 0.75);
                tooltip.style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 100) + 'px');

                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text('Wickets: ')
                    .style('color', '#2A6592');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(numberWickets)
                    .style('color', '#996600');
                tooltip.append('br')

                let tempNo;
                let batsmanNo;

                if (teamName == teamOne) {
                    tempNo = batsmanOneNumber
                    batsmanNo = 'batsmanOne'
                }
                else {
                    tempNo = batsmanTwoNumber
                    batsmanNo = 'batsmanTwo'
                }

                for (let i = 0; i < tempNo; i++) {
                    tooltip.append('span')
                        .classed('tooltip-text', true)
                        .text(Object.keys(defMatch[overNum][batsmanNo])[i] + ': ');

                    if (Object.values(defMatch[overNum][batsmanNo])[i] == 1) {
                        tooltip.append('span')
                            .classed('tooltip-text', true)
                            .text(Object.values(defMatch[overNum][batsmanNo])[i] + ' Run')
                            .style('color', '#996600');
                        tooltip.append('br');
                    }
                    else {
                        tooltip.append('span')
                            .classed('tooltip-text', true)
                            .text(Object.values(defMatch[overNum][batsmanNo])[i] + ' Runs')
                            .style('color', '#996600');
                        tooltip.append('br');
                    }
                }

                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text('Extras Runs: ')
                    .style('color', '#2A6592');
                tooltip.append('span')
                    .classed('tooltip-text', true)
                    .text(data2[match]['matchScorecard'][overNum]['extraRunsOne'])
                    .style('color', '#996600');
                tooltip.append('br')
            })
            .on('mouseout', () => {

                d3.selectAll('rect')
                    .style('opacity', 1)

                tooltip.transition().duration(500)
                    .on('end', () => tooltip.style('display', 'none'))
                    .style('opacity', 0);
            });

        svg.append('g')
            .attr('id', 'xAxis')
            .attr('transform', `translate(25, 625)`);

        let xAxisLines = d3.axisBottom(x)
            .tickFormat(d => Math.abs(d));

        d3.select('#xAxis')
            .call(xAxisLines)
            .style("font-size", "12px");

        svg.append("text")
            .attr("x", 360)
            .attr("y", 15)
            .attr("class", "title")
            .text("Over");

        svg.append("text")
            .attr("x", 360)
            .attr("y", 660)
            .attr("class", "label")
            .text("Runs");

        let totalTeamOneRuns = 0
        let totalTeamTwoRuns = 0

        let totalTeamOneWickets = 0
        let totalTeamTwoWickets = 0

        for (let i = 0; i < 20; i++) {
            totalTeamOneRuns = totalTeamOneRuns + data2[match]['matchScorecard'][i]['totalRunsOne']
            totalTeamTwoRuns = totalTeamTwoRuns + data2[match]['matchScorecard'][i]['totalRunsTwo']
            totalTeamOneWickets = totalTeamOneWickets + data2[match]['matchScorecard'][i]['wicketsOne']
            totalTeamTwoWickets = totalTeamTwoWickets + data2[match]['matchScorecard'][i]['wicketsTwo']
        }

        let result = ""

        if (match % 2 == 1) {
            result = "lost"
        }
        else {
            result = "won"
        }

        svg.append("text")
            .attr("x", 150)
            .attr("y", 690)
            .attr("class", "title")
            .text(data2[match]['teamOne'] + " " + result + " against " + data2[match]['teamTwo'] + " by " + Math.abs(10 - totalTeamTwoWickets) + " Wickets")
            .style('font-size', '20px');
    }
}