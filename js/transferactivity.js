let filteredObject = []

generateTable = (wordsObject) => {

    let margin = {
        top: 20,
        right: 10,
        bottom: 20,
        left: 10
    }
    
    let tableTotalWidth = 800
    let figureWidth = tableTotalWidth - margin.left - margin.right
    let gapPercent = 0.06 * figureWidth
    let remainingWidth = figureWidth - (4 * gapPercent)
    
    let playerWidth = remainingWidth * 0.30
    let draftWidth = remainingWidth * 0.15
    let priceWidth = remainingWidth * 0.15
    let previousTeamWidth = remainingWidth * 0.40
    
    defaultTeam = "Sunrisers Hyderabad"
    
    let tableDrawn = false
    
    d3.select('#predictionTableHead')
        .append('tr')
        .attr('id', 'columnHeaders')

    let columnHeaders = d3.select('#columnHeaders')

    filteredObject = wordsObject.filter(
       data => data['team'] === defaultTeam 
    )

    if (!tableDrawn){
        columnHeaders.append('th')
            .attr('id', 'playerHeader')
            .attr('width', playerWidth)
            .text('Players')
            .attr('class', 'sortable')
            .style('padding-left', gapPercent+'px')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'draftHeader')
            .attr('width', draftWidth)
            .text('Acquired')
            .attr('class', 'sortable')
            .style('padding-left', gapPercent+'px')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'priceHeader')
            .attr('width', priceWidth)
            .text('Cost')
            .attr('class', 'sortable')
            .style('padding-left', gapPercent+'px')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'previousTeamHeader')
            .attr('width', previousTeamWidth)
            .text('Former Team')
            .attr('class', 'sortable')
            .style('padding-left', gapPercent+'px')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        tableDrawn = true

    }
    
    let tableData = d3.select('#predictionTableBody')
        .selectAll('tr')
        .data(filteredObject)
       
     
    tableData.exit().remove()

    tableData.style('display', d => d.display ? '' : 'none')
        
    let individualTableRow = tableData
        .enter().append('tr')
    
    let playerElements = individualTableRow
        .append('td')
        .attr('width', playerWidth)
        .text(d => d['player'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')
        .style('text-align', 'left')
        .style('padding-top', gapPercent/16+'px')
        .style('padding-left', gapPercent/4+'px')
        .style('padding-bottom', gapPercent/16+'px')
        .style('background-color', function(d){
            if(d['draft'] == 'Draft Pick' || d['draft'] == 'Retained'){
                return 'yellow';
            }
            return 'orange';
        })

    let draftElements = individualTableRow
        .append('td')
        .attr('width', draftWidth)
        .text(d => d['draft'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')
        .style('text-align', 'center')
        .style('padding-top', gapPercent/16+'px')
        .style('padding-bottom', gapPercent/16+'px')
        .style('background-color', function(d){
            if(d['draft'] == 'Draft Pick' || d['draft'] == 'Retained'){
                return 'yellow';
            }
            return 'orange';
        })

    let priceElements = individualTableRow
        .append('td')
        .attr('width', priceWidth)
        .text(d => d['price'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')
        .style('text-align', 'center')
        .style('padding-top', gapPercent/16+'px')
        .style('padding-bottom', gapPercent/16+'px')
        .style('background-color', function(d){
            if(d['draft'] == 'Draft Pick' || d['draft'] == 'Retained'){
                return 'yellow';
            }
            return 'orange';
        })

    let teamNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Gaints", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
    let teamColor = ["#FFFF00", "#191970", "#87CEEB", "#4B0082", "#00FFFF", "#0000FF", "#FF0000", "#8B0000", "#FF1493", "#FF8C00"]

    let previousTeamElements = individualTableRow
        .append('td')
        .attr('width', previousTeamWidth)
        .text(d => d['previousTeam'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')
        .style('text-align', 'left')
        .style('padding-top', gapPercent/16+'px')
        .style('padding-bottom', gapPercent/16+'px')
        .style('background-color', function(d){
            if(d['draft'] == 'Draft Pick' || d['draft'] == 'Retained'){
                return 'yellow';
            }
            return 'orange';
        })
        // .style('background-color', function(d){
        //     prevTeam = d['previousTeam'];
        //     let teamID = -1;
        //     for(let i=0; i<10; i++){
        //         if(prevTeam == teamNames[i]){
        //             teamID = i;
        //         }
        //     }
        //     if(teamID != -1){
        //         return teamColor[teamID]
        //     }
        //     else{
        //         return 'yellow'
        //     }
        // })
}

headerData = [
    {
        sorted: false,
        ascending: false,
        key: 'player'
    },
    {
        sorted: false,
        ascending: false,
        key: 'draft'
    },
    {
        sorted: false,
        ascending: false,
        key: 'price'
    },
    {
        sorted: false,
        ascending: false,
        key: 'previousTeam'
    }
]

function attachSortHandlers() {
    let sortHeaders = d3.select('#columnHeaders')
            .selectAll('th')
            .data(headerData)


    sortHeaders.on('click', (d, i, nodeList) => {
        for (let entry of headerData){
            entry.sorted = false
        }
        d.sorted = true
        
        d.ascending = !d.ascending

        d3.select('#columnHeaders')
            .selectAll('th')
            .classed('sorting', false)
            .selectAll('i')
            .attr('class', 'fas no-display')

        d3.select('#'+d.key+'Header')
            .classed('sorting', true)
            .select('i')
            .attr('class', 'fas '+(d.ascending ? 'fa-sort-up' : 'fa-sort-down'))

        let sortData = (a,b) => {
            a = d.alterFunc ? d.alterFunc(a[d.key]) : a[d.key]
            b = d.alterFunc ? d.alterFunc(b[d.key]) : b[d.key]
            return d.ascending ? d3.ascending(a, b) : d3.descending(a,b)
        }

        let rowSelection = d3.select('#predictionTableBody')
                .selectAll('tr')
                .sort(sortData)

        filteredObject = filteredObject.sort(sortData)
    })   
}