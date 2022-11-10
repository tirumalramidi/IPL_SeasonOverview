let tableMargin = {top: 20, right: 10, bottom: 20, left: 10}
let tableTotalWidth = 466
let figureWidth = tableTotalWidth-tableMargin.left-tableMargin.right
let gapPercent = 0.06*figureWidth
let remainingWidth = figureWidth-(4*gapPercent)

let nameWidth = remainingWidth*0.30
let acquiredWidth = remainingWidth*0.15
let costWidth = remainingWidth*0.15
let formerWidth = remainingWidth*0.40

defaultTeam = "Sunrisers Hyderabad"

let tableDrawnYet = false

generateTable = (wordsObject) => {
    
    d3.select('#predictionTableHead')
        .append('tr')
        .attr('id', 'columnHeaders')

    let columnHeaders = d3.select('#columnHeaders')

    let filteredObject = wordsObject.filter(
       data => data['team'] === defaultTeam 
    )

    if (!tableDrawnYet){
        columnHeaders.append('th')
            .attr('id', 'nameHeader')
            .attr('width', nameWidth)
            .text('Player Name')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'acquiredHeader')
            .attr('width', acquiredWidth)
            .text('Acquired')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'costHeader')
            .attr('width', costWidth)
            .text('Cost in USD')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'formerHeader')
            .attr('width', formerWidth)
            .text('Former Team')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
            .attr('class', 'fas no-display')

        tableDrawnYet = true

    }
    
    let tableData = d3.select('#predictionTableBody')
        .selectAll('tr')
        .data(filteredObject)
       
     
    tableData.exit().remove()

    tableData.style('display', d => d.display ? '' : 'none')
        
    let individualTableRow = tableData
        .enter().append('tr')
    
    let nameElements = individualTableRow
        .append('td')
        .attr('width', nameWidth)
        .text(d => d['player'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')

    let acquiredElements = individualTableRow
        .append('td')
        .attr('width', acquiredWidth)
        .text(d => d['draft'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')

    let costElements = individualTableRow
        .append('td')
        .attr('width', costWidth)
        .text(d => d['price'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')

    let formerElements = individualTableRow
        .append('td')
        .attr('width', formerWidth)
        .text(d => d['previousTeam'])
        .style('vertical-align', 'middle')
        .style('font-size', '16px')
        .style('text-align', 'right')
   

}
headerData = [
    {
        sorted: false,
        ascending: false,
        key: 'name'
    },
    {
        sorted: false,
        ascending: false,
        key: 'acquired'
    },
    {
        sorted: false,
        ascending: false,
        key: 'cost',
        alterFunc: d => +d
    },
    {
        sorted: false,
        ascending: false,
        key: 'former'
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