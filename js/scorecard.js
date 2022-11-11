render = (data) => {

    let teamNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Gaints", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
    let teamColor = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

    let width = 700
    let height = 600
    let labelArea = 100

    margin = {
        top: 20,
        left: 100,
        right: 40,
        bottom: 40
    };

    const x = d3.scaleLinear()
        .domain([-20, 20])
        .range([0, width + labelArea]);

    const y = d3.scaleBand()
        .domain(data.map(d => d['Over']))
        .range([0, height])
        .padding(0.1);

    const svg = d3.select('#scorecard')
        .append('svg')
        .attr('width', width + margin.left + margin.right + labelArea)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left} ${margin.right})`);

    const barGroups = g
        .selectAll('.barGroup')
        .data(data);

    barGroups.exit().remove();

    const newBarGroups = barGroups.enter()
        .append('g')
        .attr('class', 'barGroup');

    newBarGroups
        .append('rect')
        .attr('class', 'positive')
        .attr('fill', '#FF1493');

    newBarGroups
        .append('rect')
        .attr('class', 'negative')
        .attr('fill', '#87CEEB');

    const positiveBars = newBarGroups
        .merge(barGroups)
        .select('.positive')
        .datum(d => ({
            name: d['Over'],
            value: d[`${data[0]['teamOne']} Runs`],
            team: d['teamOne']
        }));

    const negativeBars = newBarGroups
        .merge(barGroups)
        .select('.negative')
        .datum(d => ({
            name: d['Over'],
            value: -parseInt(d[`${data[0]['teamTwo']} Runs`]),
            team: d['teamTwo']
        }));

    svg.selectAll("text.name")
        .data(data)
        .enter().append("text")
        .attr("x", (labelArea) + width / 2)
        .attr("y", function (d) {
            return y(d['Over']) + y.bandwidth();
        })
        .attr('transform', `translate(50, 30)`)
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(function (d) { return d['Over']; });

    newBarGroups.selectAll('rect')
        .attr('x', d => d.team == data[0]['teamOne'] ? x(0) + labelArea / 2 : x(d.value) - labelArea / 2)
        .attr('y', d => y(d.name))
        .attr('width', d => { return d.team == data[0]['teamOne'] ? x(d.value) - x(0) : x(0) - x(d.value) })
        .attr('height', y.bandwidth())

    g.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    svg.append("text")
        .attr("x", width / 3 + labelArea)
        .attr("y", 14)
        .attr("class", "title")
        .text(`${data[0]['teamTwo']}`);
    svg.append("text")
        .attr("x", width / 6 + width / 2 + labelArea)
        .attr("y", 14)
        .attr("class", "title")
        .text(`${data[0]['teamOne']}`);
    svg.append("text")
        .attr("x", width / 2 + labelArea + labelArea / 3)
        .attr("y", 14)
        .attr("class", "title")
        .text("Over");
}