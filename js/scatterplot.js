generateScatterPlot = (data) => {
    //console.log("Auction", data[0]);
    // console.log("Bat", data[1]);
    //console.log("Bowl", data[2]);
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let xMax = d3.max(data, function(d){return d.batAverage})
    let yMax = d3.max(data.map(d => d["runs"]))

    console.log("Average:", xMax)
    //console.log("Runs", yMax)
    
        // append the svg object to the body of the page
    var svg = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, d3.max(
                data.map(
                    d => d["batAverage"]
                )
            )
            ])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(
                data.map(d => d["runs"])
            )
            ])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        //console.log("filtered",d3.max(data[1].map(d => d["Runs"])))
        // Add dots

        // Color scale
        const color = d3.scaleOrdinal()
    .domain(["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans",
            "Kolkata Knight Riders","Lucknow Super Giants","Mumbai Indians",
            "Punjab Kings","Royal Challengers Bangalore","Rajasthan Royals",
            "Sunrisers Hyderabad" ])
    .range([ "#FFFF00", "#191970", "#87CEEB", "#4B0082", 
            "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"])

        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { 
                //console.log("bowl,,,",d.Innings)
                return x(d["batAverage"])  != '' ? x(d["batAverage"]) : 0; })
            .attr("cy", function (d) { 
                //console.log("bowl,,,",d.Runs)
                return y(d["batAverage"]) != '' ? y(d["runs"]) : 0; })
            .attr("r", 4.0)
            .style("fill", function (d) { return color(d['team']) } )

}