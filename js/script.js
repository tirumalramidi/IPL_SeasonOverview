auctionData = d3.csv("./data/AuctionData.csv")
battingData = d3.csv("./data/BattingStatistics.csv")
bowlingData = d3.csv("./data/BowlingStatistics.csv")
scorecardData = d3.csv("./data/BallByBall.csv")

Promise.all([auctionData, battingData, bowlingData]).then(data => {

    console.log(scorecardData)

    masterArray = []

    maximumRowSize = [...Array(Math.max(data[0].length, data[1].length, data[2].length)).keys()]

    for (let row in maximumRowSize) {

        let tempObject = {}

        ptp1 = ['player', 'team', 'price']
        ptp2 = ['Player', 'Team', 'Cost']

        for (let i = 0; i < 3; i++) {
            tempObject[ptp1[i]] = data[0][row][ptp2[i]]
        }

        tempObject["previousTeam"] = data[0][row]["2021 Squad"] != '' ? data[0][row]["2021 Squad"] : 'NA'
        tempObject["draft"] = data[0][row]["Retained / Draft Pick"] == 'Retained' || data[0][row]["Retained / Draft Pick"] == 'Draft Pick' ? data[0][row]["Retained / Draft Pick"] : 'Bought'

        battingObject = data[1].filter(batting => batting['Player'] == data[0][row]['Player'])

        bbnrhbbscffs1 = ['batInnings', 'batMatches', 'notOut', 'runs', 'highScore', 'batAverage', 'ballsFaced', 'strikeRate', 'centuries', 'fifties', 'foures', 'sixes']
        bbnrhbbscffs2 = ['Innings', 'Matches', 'Not Out', 'Runs', 'High Score', 'Average', 'Balls Faced', 'Strike Rate', '100', '50', '4s', '6s']

        for (let i = 0; i < 12; i++) {
            tempObject[bbnrhbbscffs1[i]] = battingObject.length != 0 ? parseInt(battingObject[0][bbnrhbbscffs2[i]]) : ''
        }

        bowlingObject = data[2].filter(bowling => bowling['Player'] == data[0][row]['Player'])

        bbbrwbebff1 = ['bowlMatches', 'bowlInnings', 'bowlOvers', 'runsGiven', 'wicketsTaken', 'bowlAverage', 'economy', 'bowlSR', 'fourW', 'fiveW']
        bbbrwbebff2 = ['Matches', 'Innings', 'Overs', 'Runs', 'Wickets', 'Average', 'Economy', 'Strike Rate', '4W', '5W']

        for (let i = 0; i < 10; i++) {
            tempObject[bbbrwbebff1[i]] = bowlingObject.length != 0 ? parseInt(bowlingObject[0][bbbrwbebff2[i]]) : ''
        }

        masterArray.push(tempObject);

    }
    //console.log("masterArray", masterArray)

    generateTeams()
    generateScorecard()
    generateScatterPlot(masterArray)
    generateTable(masterArray)
    attachSortHandlers()
})