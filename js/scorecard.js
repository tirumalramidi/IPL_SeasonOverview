generateScorecard = () => {

    const data = [{
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    },
    {
        "name": 1,
        "awayRuns": 20,
        "homeRuns": -80
    }];

    const width = 600,
        height = 300,
        margin = {
            top: 20,
            left: 100,
            right: 40,
            bottom: 40
        };

    const x = d3.scaleLinear()
        .domain([-100, 100])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.value))
        .range([height, 0])
        .padding(0.1);

    const svg = d3.select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left} ${margin.right})`);

    const barGroups = g.selectAll('.barGroup')
        .data(data);

    barGroups.exit().remove();

    const newBarGroups = barGroups.enter()
        .append('g')
        .attr('class', 'barGroup');

    newBarGroups
        .append('rect')
        .attr('class', 'positive')
        .attr('fill', 'darkgreen');

    newBarGroups
        .append('rect')
        .attr('class', 'negative')
        .attr('fill', 'darkred');

    const positiveBars = newBarGroups
        .merge(barGroups)
        .select('.positive')
        .datum(d => ({
            name: d.name,
            value: d.awayRuns
        }));

    const negativeBars = newBarGroups
        .merge(barGroups)
        .select('.negative')
        .datum(d => ({
            name: d.name,
            value: d.homeRuns
        }));

    newBarGroups.selectAll('rect')
        .attr('x', d => d.value > 0 ? x(0) : x(d.value))
        .attr('y', d => y(d.name))
        .attr('width', d => d.value > 0 ? x(d.value) - x(0) : x(0) - x(d.value))
        .attr('height', y.bandwidth())

    g.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    g.append('g')
        .classed('y-axis', true)
        .attr('transform', `translate(${x(0)}, 0)`)
        .call(d3.axisLeft(y))
}