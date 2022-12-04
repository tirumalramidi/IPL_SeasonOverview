render = (data1, data2) => {

    let teamNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Gaints", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
    let teamColor = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

    let width = 600
    let height = 600
    let labelArea = 100

    margin = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 50
    };

    let teamOneMaxRuns = d3.max(data1.map(d => d["teamOneRuns"]));
    let teamTwoMaxRuns = d3.max(data1.map(d => d["teamTwoRuns"]));

    let runsDomain = Math.ceil((d3.max([teamOneMaxRuns, teamTwoMaxRuns])) / 5) * 5;

    let tooltip = d3.select('#scatterPlot')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
        .style('opacity', 0);

    const x = d3.scaleLinear()
        .domain([-runsDomain, runsDomain])
        .range([0, width + labelArea]);

    const y = d3.scaleBand()
        .domain(data1.map(d => d['Over']))
        .range([0, height])
        .padding(0.1);

    const svg = d3.select('#scorecard')
        .append('svg')
        .attr('width', width + margin.left + margin.right + labelArea)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.right})`);

    const barGroups = g.selectAll('.barGroup')
        .data(data1);

    barGroups.exit().remove();

    const newBarGroups = barGroups.enter()
        .append('g')
        .attr('class', 'barGroup');

    newBarGroups.append('rect')
        .attr('class', 'positive')
        .attr('fill', '#FF1493');

    newBarGroups.append('rect')
        .attr('class', 'negative')
        .attr('fill', '#87CEEB');

    newBarGroups.merge(barGroups)
        .select('.positive')
        .datum(d => ({
            name: d['Over'],
            value: d["teamOneRuns"],
            team: d['teamOne']
        }));

    newBarGroups.merge(barGroups)
        .select('.negative')
        .datum(d => ({
            name: d['Over'],
            value: -parseInt(d["teamTwoRuns"]),
            team: d['teamTwo']
        }));

    svg.selectAll("text.name")
        .data(data1)
        .enter()
        .append("text")
        .attr("x", (labelArea) + width / 2 - 75)
        .attr("y", function (d) {
            return y(d['Over']) + y.bandwidth();
        })
        .attr('transform', `translate(50, 10)`)
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(function (d) { return +d['Over'] + 1; });

    let defaultMatch = '73'

    newBarGroups.selectAll('rect')
        .attr('x', d => d.team == data2[defaultMatch]['teamOne'] ? x(0) + labelArea / 2 : x(d.value) - labelArea / 2)
        .attr('y', d => y(d.name))
        .attr('width', d => { return d.team == data2[defaultMatch]['teamOne'] ? x(d.value) - x(0) : x(0) - x(d.value) })
        .attr('height', y.bandwidth())
        .on("mouseover", function (event, d) {

            d3.selectAll('rect')
                .style('opacity', 0.33)

            d3.select(this)
                .style('opacity', 1)

            let teamOne = data2[defaultMatch]['teamOne']

            let overNum = d['name']
            let teamName = d['team']

            let match = data2[defaultMatch]['matchScorecard']

            let batsmanOneNumber = Object.keys(match[overNum]['batsmanOne']).length
            let batsmanTwoNumber = Object.keys(match[overNum]['batsmanTwo']).length

            let numberWickets;

            if (teamName == teamOne) {
                numberWickets = match[overNum]['wicketsOne']
            }
            else {
                numberWickets = match[overNum]['wicketsTwo']
            }

            tooltip.text("");
            tooltip.style("display", "block")
                .transition().duration(200)
                .style("opacity", 0.75);
            tooltip.style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 50) + 'px');
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
                    .text(Object.keys(match[overNum][batsmanNo])[i] + ': ');
    
                if (Object.values(match[overNum][batsmanNo])[i] == 1) {
                    tooltip.append('span')
                        .classed('tooltip-text', true)
                        .text(Object.values(match[overNum][batsmanNo])[i] + ' Run')
                        .style('color', '#996600');
                    tooltip.append('br');
                }
                else {
                    tooltip.append('span')
                        .classed('tooltip-text', true)
                        .text(Object.values(match[overNum][batsmanNo])[i] + ' Runs')
                        .style('color', '#996600');
                    tooltip.append('br');
                }
            }
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
}