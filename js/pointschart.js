generatePoints = (data, selectedTeam) => {

    let selectData = [
        { "text": "Position" },
        { "text": "Wins" },
        { "text": "Losses" },
        { "text": "Net Run Rate" }
    ]

    let body = d3.select('#pointsHistory')

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
            top: 10,
            right: 30,
            bottom: 30,
            left: 60
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

        let line = svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { 
                if(selectedTeam == 'none')
                    return color(d.key)
                if(d.key == selectedTeam && selectedTeam != 'none')
                    return color(d.key)
                else
                    return 'gray' })
            .attr("stroke-width", function(d) {
                if(d.key == selectedTeam && selectedTeam != 'none')
                    return 1.5
                else
                    return 0.5
            })
            .attr("d", function (d) {
                if (varSelect == -1) {
                    console.log("Hello")
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
            .style('opacity',function (d) { 
                if(selectedTeam == 'none')
                    return 1
                if(d.key == selectedTeam && selectedTeam != 'none')
                    return 1
                else
                    return 0.2 })
            .on("mouseover", function (event, i, n) {
                //console.log('MouseOver')
            })
            .on("mouseout", function (d, i) {
                //console.log('MouseOut')
            })
            .on("mousedown", function (d, i) {
                //console.log('MouseDown')
            });
    }
}