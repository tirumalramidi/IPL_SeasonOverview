generatePoints = (data) => {
    
    let selectData = [
        { "text": "Position" },
        { "text": "Net Run Rate" },
        { "text": "Wins" },
        { "text": "Losses" }
    ]

    let body = d3.select('#pointsHistory')

    var span = body.append('span')
        .text('What to display on Y-Axis: ')

    var xInput = body.append('select')
        .attr('id', 'xSelect')
        .selectAll('option')
        .data(selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    body.append('br')
    body.append('br')

    let newData = 'Position'

    d3.select('#xSelect')
        .on('change', function () {

            newData = d3.select(this).property('value');
            console.log(newData);
        });

    let xSelectData = ["Position", "Net Run Rate", "Wins", "Losses"]
    let xOrigData = ["Position", "NRR", "Wins", "Losses"]

    let varSelect = -1
    for(let i=0; i<4; i++){
        if(xSelectData[i] == newData)
            varSelect = i
    }

    let margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60
    }

    width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

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

    let y = d3.scaleLinear()
        .domain([d3.max(data, function (d) { return +d.Position; }), 1])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "12px");

    let res = sumstat.map(function (d) { return d.key })

    let color = d3.scaleOrdinal()
        .domain(res)
        .range(["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#FFD700", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"])

    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(+d["Matches"]); })
                .y(function (d) { return y(+d[xOrigData[varSelect]]); })
                (d.values)
        })
        .attr("stroke-width", "2.5px");

    //ADDING CIRCLES IG?
    
    // svg.selectAll(".circle")
    //     .data(sumstat)
    //     .enter()
    //     .append("circle")
    //     .attr('r', 2)
    //     .attr('cx', function(d){
    //         return x(d.close);
    //     })
    //     .attr('cy', function(d){
    //         return y(d.close);
    //     });
}