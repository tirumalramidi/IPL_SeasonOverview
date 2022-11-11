// const data = [{
//     "name": 'IT',
//     "value": 20,
//     "negativeValue": -80
//   }, {
//     "name": 'Capital Invest',
//     "value": 30,
//     "negativeValue": -70
//   }, {
//     "name": 'Infrastructure',
//     "value": 40,
//     "negativeValue": -60
//   }];
  
render = (data) => {
    const width = 600,
    labelArea = 100,
    height = 600,
    margin = {
      top: 20,
      left: 100,
      right: 40,
      bottom: 40
    };
  
  // Now, we don't use 0 as a minimum, but get it from the data using d3.extent
  const x = d3.scaleLinear()
    .domain([-40, 40])
    .range([0, width + labelArea]);
  
  const y = d3.scaleBand()
    .domain(data.map(d => d['Over']))
    .range([height, 0])
    .padding(0.1);
  
  const svg = d3.select('#scorecard')
    .append('svg')
    .attr('width', width + margin.left + margin.right + labelArea)
    .attr('height', height + margin.top + margin.bottom);
  
  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left} ${margin.right})`);
  
  // One group per data entry, each holding two bars
  const barGroups = g
    .selectAll('.barGroup')
    .data(data);
  
  barGroups.exit().remove();
  
  const newBarGroups = barGroups.enter()
    .append('g')
    .attr('class', 'barGroup');
  
  // Append one bar for the positive value, and one for the negative one
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
      name: d['Over'],
      value: d[`${data[0]['teamOne']} Runs`],
      team : d['teamOne']
    }));
  
  const negativeBars = newBarGroups
    .merge(barGroups)
    .select('.negative')
    .datum(d => ({
      name: d['Over'],
      value: -parseInt(d[`${data[0]['teamTwo']} Runs`]),
      team : d['teamTwo']
    }));

    svg.selectAll("text.name")
                .data(data)
                .enter().append("text")
                .attr("x", (labelArea ) + width/2)
                .attr("y", function (d) {
                    return y(d['Over']) + y.bandwidth();
                })
                .attr('transform', `translate(50, 30)`)

                .attr("dy", ".20em")
                .attr("text-anchor", "middle")
                .attr('class', 'name')
                .text(function(d){return d['Over'];});
  
  newBarGroups.selectAll('rect')
    // If a bar is positive it starts at x = 0, and has positive width
    // If a bar is negative it starts at x < 0 and ends at x = 0
    .attr('x', d => d.team == data[0]['teamOne'] ? x(0) + labelArea / 2 : x(d.value) - labelArea / 2 )
    .attr('y', d => y(d.name))
    // If the bar is positive it ends at x = v, but that means it's x(v) - x(0) wide
    // If the bar is negative it ends at x = 0, but that means it's x(0) - x(v) wide
    .attr('width', d => {{console.log("x(d.value)",d,"value",d.value,"x(0)",x(0))}; return d.team == data[0]['teamOne'] ? x(d.value) - x(0) : x(0) - x(d.value)})
    .attr('height', y.bandwidth())
  // Let's color the bar based on whether the value is positive or negative
  
  g.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))
  
//   g.append('g')
//     .classed('y-axis', true)
//     .attr('transform', `translate(${x(0)}, 0)`)
//     .call(d3.axisLeft(y))
}