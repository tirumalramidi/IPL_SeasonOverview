generateTeams = (selectedTeam) => {

    let teamSelected = ''

    let teamNames = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PK", "RCB", "RR", "SRH"]
    let teamColor = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

    var margin = {
        top: 100,
        right: 50,
        bottom: 50,
        left: 100
    }

    let width = 1500 - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;

    let hexColumns = 10
    let hexRows = 1

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
        })
        .attr("stroke", '#FFD700')
        .attr('stroke-width', '4px');

    let cskImg = svg.append("g")
    cskImg.append("svg:image")
        .attr("xlink:href", "assets/csk.png")
        .attr("x", "-50")
        .attr("y", "-50")
        .attr("width", "100")
        .attr("height", "100");

    let dcImg = svg.append("g")
    dcImg.append("svg:image")
        .attr("xlink:href", "assets/dc.png")
        .attr("x", "80")
        .attr("y", "-50")
        .attr("width", "100")
        .attr("height", "100");

    let gtImg = svg.append("g")
    gtImg.append("svg:image")
        .attr("xlink:href", "assets/gt.png")
        .attr("x", "200")
        .attr("y", "-60")
        .attr("width", "115")
        .attr("height", "115");

    let kkrImg = svg.append("g")
    kkrImg.append("svg:image")
        .attr("xlink:href", "assets/kkr.png")
        .attr("x", "340")
        .attr("y", "-50")
        .attr("width", "100")
        .attr("height", "100");

    let lsgImg = svg.append("g")
    lsgImg.append("svg:image")
        .attr("xlink:href", "assets/lsg.png")
        .attr("x", "455")
        .attr("y", "-55")
        .attr("width", "120")
        .attr("height", "120");

    let miImg = svg.append("g")
    miImg.append("svg:image")
        .attr("xlink:href", "assets/mi.png")
        .attr("x", "595")
        .attr("y", "-50")
        .attr("width", "100")
        .attr("height", "100");

    let pkImg = svg.append("g")
    pkImg.append("svg:image")
        .attr("xlink:href", "assets/pk.png")
        .attr("x", "724")
        .attr("y", "-50")
        .attr("width", "100")
        .attr("height", "100");

    let rcbImg = svg.append("g")
    rcbImg.append("svg:image")
        .attr("xlink:href", "assets/rcb.png")
        .attr("x", "850")
        .attr("y", "-50")
        .attr("width", "100")
        .attr("height", "100");

    let rrImg = svg.append("g")
    rrImg.append("svg:image")
        .attr("xlink:href", "assets/rr.png")
        .attr("x", "980")
        .attr("y", "-50")
        .attr("width", "100")
        .attr("height", "100");

    let srhImg = svg.append("g")
    srhImg.append("svg:image")
        .attr("xlink:href", "assets/srh.png")
        .attr("x", "1100")
        .attr("y", "-50")
        .attr("width", "120")
        .attr("height", "120");
}