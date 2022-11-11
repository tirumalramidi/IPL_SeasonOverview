generateTeams = () => {

    let teamNames = ["CSK", "DC", "GT", "KKR", "LSG", "IPL", "MI", "", "PK", "RCB", "RR", "SRH"]
    let teamColor = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#FFFFFF", "#0000FF", "#FFFFFF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

    let x = -50
    let y = 85

    let iplImage = "./assets/ipl.png"
    let cskImage = "./assets/csk.png"
    let dcImage = ""
    let gtImage = ""
    let kkrImage = ""
    let lsgImage = ""
    let miImage = ""
    let pkImage = ""
    let rcbImage = ""
    let rrImage = ""
    let srhImage = ""



    let textArray = [
        ['Chennai Super Kings', x, 400, x + 15, '#FFFF00'],
        ['Delhi Capitals', x, 430, x + 15, '#191970'],
        ['Gujarat Titans', x + 2 * y, 400, x + 2 * y + 15, '#87CEEB'],
        ['Kolkata Knight Riders', x + 4.3 * y, 460, x + 4.3 * y + 15, '#4B0082'],
        ['Lucknow Super Giants', x + 3.75 * y, 400, x + 3.75 * y + 15, '#00FFFF'],
        ['Mumbai Indians', x + 2 * y, 430, x + 2 * y + 15, '#0000FF'],
        ['Punjab Kings', x + 6 * y, 400, x + 6 * y + 15, '#FF0000'],
        ['Royal Challengers Banglore', x + 1.6 * y, 460, x + 1.6 * y + 15, '#8B0000'],
        ['Rajasthan Royals', x + 6 * y, 430, x + 6 * y + 15, '#FF1493'],
        ['Sunrisers Hyderabad', x + 3.75 * y, 430, x + 3.75 * y + 15, '#FF8C00']
    ]

    var margin = {
        top: 100,
        right: 50,
        bottom: 50,
        left: 100
    }

    let width = 800 - margin.left - margin.right;
    let height = 700 - margin.top - margin.bottom;

    let hexColumns = 4
    let hexRows = 3

    let hexRadius = d3.min([width / ((hexColumns + 0.5) * Math.sqrt(3)), height / ((hexRows + 1 / 3) * 1.5)]);

    width = hexColumns * hexRadius * Math.sqrt(3);
    height = hexRows * 1.5 * hexRadius + 0.5 * hexRadius;

    let hexbin = d3.hexbin().radius(hexRadius);

    let points = []
    for (let i = 0; i < hexRows; i++) {
        for (let j = 0; j < hexColumns; j++) {
            let x = hexRadius * j * Math.sqrt(3)
            if (i % 2 === 1) {
                x += (hexRadius * Math.sqrt(3)) / 2
            }
            let y = hexRadius * i * 1.5
            points.push([x, y])
        }
    }

    let svg = d3.select("#teams")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .selectAll(".hexagon")
        .data(hexbin(points))
        .enter()
        .append("path")
        .attr("class", "hexagon")
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y + hexbin.hexagon();
        })
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .attr('text', function (d, i) {
            if (i == 5) {
                return 'IPL'
            }
            return ''
        })
        .attr("fill", function (d, i) {
            return teamColor[i];
        });

    img = svg.selectAll("image").data([1]);
    img.enter()
        .append("svg:image")
        .attr("xlink:href", iplImage)
        .attr("x", "167")
        .attr("y", "75")
        .attr("width", "100")
        .attr("height", "100");

    img = svg.selectAll("image")
        .append("svg:image")
        .attr("xlink:href", cskImage)
        .attr("x", "100")
        .attr("y", "100")
        .attr("width", "100")
        .attr("height", "100");

    for (let text in textArray) {
        svg.append("circle").attr("cx", textArray[text][1]).attr("cy", textArray[text][2]).attr("r", 7).style("fill", `${textArray[text][4]}`)
        svg.append("text").attr("x", textArray[text][3]).attr("y", textArray[text][2]).text(`${textArray[text][0]}`).style("font-size", "15px").attr("alignment-baseline", "middle")

    }
}