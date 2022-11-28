window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 550 || document.documentElement.scrollTop > 550) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-50px";
  }
}

auctionData = d3.csv("./data/AuctionData.csv")
battingData = d3.csv("./data/BattingStatistics.csv")
bowlingData = d3.csv("./data/BowlingStatistics.csv")
scorecardData = d3.csv("./data/BallByBall.csv")
pointsData = d3.csv("./data/TeamPositions.csv")

Promise.all([auctionData, battingData, bowlingData, scorecardData, pointsData]).then(data => {

    masterArray = []
    ballBallArray = []
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

        bbnrhbbscffs1 = ['batInnings', 'batMatches', 'notOut', 'runs', 'highScore', 'batAverage', 'ballsFaced', 'strikeRate', 'centuries', 'fifties', 'fours', 'sixes']
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

    let scorecardData = data[3].filter(
        d => d['Match ID'] == '1312200'
    )

    newScore = scorecardData.reduce((group, score) => {
        const { BattingTeam } = score;
        group[BattingTeam] = group[BattingTeam] ?? [];
        group[BattingTeam].push(score);
        return group;
      }, {});

    let finalScoreSheet = []
    
    const Overs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    const keys = Object.keys(newScore);

    for (let over in Overs){
        let scoreSheet = {}

            tempScoreOfTeamOne = newScore[`${keys[0]}`].filter(score => score['Over'] == Overs[over])
            tempScoreOfTeamTwo = newScore[`${keys[1]}`].filter(score => score['Over'] == Overs[over])

            ballRunsInOverTeamOne =  tempScoreOfTeamOne.map(score => parseInt(score['Total Runs']));
            ballRunsInOverTeamTwo =  tempScoreOfTeamTwo.map(score => parseInt(score['Total Runs']));

            runsInOverTeamOne = ballRunsInOverTeamOne.reduce((partialSum, a) => partialSum + a, 0)
            runsInOverTeamTwo = ballRunsInOverTeamTwo.reduce((partialSum, a) => partialSum + a, 0)

            scoreSheet = {
                'Over' : over
            }
            scoreSheet[`${keys[1]} Runs`] = runsInOverTeamTwo
            scoreSheet[`${keys[0]} Runs`] = runsInOverTeamOne
            scoreSheet['teamOne'] = keys[0]
            scoreSheet['teamTwo'] = keys[1]

        finalScoreSheet.push(scoreSheet)
    }

    generateTeams()
    generateScatterPlot(masterArray)
    generateTable(masterArray)
    attachSortHandlers()
    render(finalScoreSheet);
    generatePoints(data[4])
})