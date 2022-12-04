let selectedTeam = ''

window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").style.top = "-50px";
    }
};



auctionData = d3.csv("./data/AuctionData.csv")
battingData = d3.csv("./data/BattingStatistics.csv")
bowlingData = d3.csv("./data/BowlingStatistics.csv")
scorecardData = d3.csv("./data/BallByBall.csv")
pointsData = d3.csv("./data/TeamPositions.csv")

Promise.all([auctionData, battingData, bowlingData, scorecardData, pointsData]).then(data => {
    // console.log("Came promise")
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

        battingObject = data[1].filter(batting => batting['Player'] === data[0][row]['Player'])
        // console.log("batt",battingObject)
        // console.log("batt",battingObject.filter(batting => batting['Player'] == 'Saurabh Dubey'));

        bbnrhbbscffs1 = ['batInnings', 'batMatches', 'notOut', 'runs', 'highScore', 'batAverage', 'ballsFaced', 'strikeRate', 'centuries', 'fifties', 'fours', 'sixes']
        bbnrhbbscffs2 = ['Innings', 'Matches', 'Not Out', 'Runs', 'High Score', 'Average', 'Balls Faced', 'Strike Rate', '100', '50', '4s', '6s']

        for (let i = 0; i < 12; i++) {
            tempObject[bbnrhbbscffs1[i]] = battingObject.length != 0 ? parseInt(battingObject[0][bbnrhbbscffs2[i]]) : ''
        }

        bowlingObject = data[2].filter(bowling => bowling['Player'] == data[0][row]['Player'])

        bbbrwbebff1 = ['bowlMatches', 'bowlInnings', 'bowlOvers', 'runsGiven', 'wicketsTaken', 'bowlAverage', 'economy', 'bowlSR', 'fourW', 'fiveW']
        bbbrwbebff2 = ['Matches', 'Innings', 'Overs', 'Runs', 'Wickets', 'Average', 'Economy', 'Strike Rate', '4W', '5W']

        for (let i = 0; i < 10; i++) {
            if (bbbrwbebff2[i] == 'Average') {
                tempObject[bbbrwbebff1[i]] = bowlingObject.length != 0 ? parseFloat(bowlingObject[0][bbbrwbebff2[i]]) : ''
            } else {
                tempObject[bbbrwbebff1[i]] = bowlingObject.length != 0 ? parseInt(bowlingObject[0][bbbrwbebff2[i]]) : ''
            }
        }

        if (bowlingObject.length > 0 || battingObject.length > 0) {
            masterArray.push(tempObject) ? (bowlingObject.length != 0 && bowlingObject[0]['Matches'] > 0) && (battingObject.length != 0 && battingObject[0]['Matches'] > 0) : '';
        }
    }

    let scorecardData = data[3].filter(
        d => d['MatchID'] == '1312200'
    )

    matchMater = data[3].reduce((group, score) => {
        const { MatchID } = score;
        group[MatchID] = group[MatchID] ?? [];
        group[MatchID].push(score);
        return group;
    }, {});

    newScore = scorecardData.reduce((group, score) => {
        const { BattingTeam } = score;
        group[BattingTeam] = group[BattingTeam] ?? [];
        group[BattingTeam].push(score);
        return group;
    },
        {});

    const masterScoreKeys = Object.keys(matchMater);
    const Overs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

    let seasonMaster = []
    for (let match in masterScoreKeys) {
        let currentMatchArray = matchMater[masterScoreKeys[match]]
        let matchMasterObject = []
        const teamsPlayed = [...new Set(currentMatchArray.map(match => match["BattingTeam"]))];

        teamOneData = currentMatchArray.filter(batting => batting['BattingTeam'] == teamsPlayed[0])
        teamTwoData = currentMatchArray.filter(batting => batting['BattingTeam'] == teamsPlayed[1])

        for (let over in Overs) {
            overDataOfTeamOne = teamOneData.filter(overData => overData['Over'] == Overs[over])
            overDataOfTeamTwo = teamTwoData.filter(overData => overData['Over'] == Overs[over])
            const batsmanPlayedForTeamOne = [...new Set(overDataOfTeamOne.map(match => match["Batsman"]))];
            const batsmanPlayedForTeamTwo = [...new Set(overDataOfTeamTwo.map(match => match["Batsman"]))];
            let batsmanRunsTeamOne = {}
            let batsmanRunsTeamTwo = {}
            wicketsDataOfTeamOne = overDataOfTeamOne.map(score => parseInt(score['Wicket?']));
            wicketsByTeamOne = wicketsDataOfTeamOne.reduce((partialSum, a) => partialSum + a, 0)

            wicketsDataOfTeamTwo = overDataOfTeamTwo.map(score => parseInt(score['Wicket?']));
            wicketsByTeamTwo = wicketsDataOfTeamTwo.reduce((partialSum, a) => partialSum + a, 0)

            extraRunsOfTeamOneData = overDataOfTeamTwo.map(score => parseInt(score['Extras Run']));
            extraRunsTeamOne = extraRunsOfTeamOneData.reduce((partialSum, a) => partialSum + a, 0)

            extraRunsOfTeamTwoData = overDataOfTeamTwo.map(score => parseInt(score['Extras Run']));
            extraRunsTeamTwo = extraRunsOfTeamTwoData.reduce((partialSum, a) => partialSum + a, 0)

            ballRunsInOverTeamOne = overDataOfTeamOne.map(score => parseInt(score['Total Runs']));
            ballRunsInOverTeamTwo = overDataOfTeamTwo.map(score => parseInt(score['Total Runs']));

            runsInOverTeamOne = ballRunsInOverTeamOne.reduce((partialSum, a) => partialSum + a, 0)
            runsInOverTeamTwo = ballRunsInOverTeamTwo.reduce((partialSum, a) => partialSum + a, 0)

            for (let batsman in batsmanPlayedForTeamOne) {
                batsmanData = overDataOfTeamOne.filter(batting => batting['Batsman'] == batsmanPlayedForTeamOne[batsman])
                batsmanRuns = batsmanData.map(score => parseInt(score['Batsman Runs']));
                runsByBatsman = batsmanRuns.reduce((partialSum, a) => partialSum + a, 0)
                batsmanRunsTeamOne[batsmanPlayedForTeamOne[batsman]] = runsByBatsman
            }
            for (let batsman in batsmanPlayedForTeamTwo) {
                batsmanData = overDataOfTeamTwo.filter(batting => batting['Batsman'] == batsmanPlayedForTeamTwo[batsman])
                batsmanRuns = batsmanData.map(score => parseInt(score['Batsman Runs']));
                runsByBatsman = batsmanRuns.reduce((partialSum, a) => partialSum + a, 0)
                batsmanRunsTeamTwo[batsmanPlayedForTeamTwo[batsman]] = runsByBatsman
            }

            let tempObject = {}
            tempObject['over'] = Overs[over]
            tempObject['totalRunsOne'] = runsInOverTeamOne
            tempObject['totalRunsTwo'] = runsInOverTeamTwo
            tempObject['extraRunsOne'] = extraRunsTeamOne
            tempObject['extraRunsTwo'] = extraRunsTeamTwo
            tempObject['wicketsOne'] = wicketsByTeamOne
            tempObject['wicketsTwo'] = wicketsByTeamTwo
            tempObject['batsmanOne'] = batsmanRunsTeamOne
            tempObject['batsmanTwo'] = batsmanRunsTeamTwo

            matchMasterObject.push(tempObject);
        }

        let tempObject = {}
        tempObject['teamOne'] = teamsPlayed[0]
        tempObject['teamTwo'] = teamsPlayed[1]
        tempObject['matchNo.'] = match
        tempObject['matchId'] = masterScoreKeys[match]
        tempObject['matchScorecard'] = matchMasterObject
        seasonMaster.push(tempObject)
    }

    let finalScoreSheet = []

    const keys = Object.keys(newScore);

    for (let over in Overs) {
        let scoreSheet = {}

        tempScoreOfTeamOne = newScore[`${keys[0]}`].filter(score => score['Over'] == Overs[over])
        tempScoreOfTeamTwo = newScore[`${keys[1]}`].filter(score => score['Over'] == Overs[over])

        ballRunsInOverTeamOne = tempScoreOfTeamOne.map(score => parseInt(score['Total Runs']));
        ballRunsInOverTeamTwo = tempScoreOfTeamTwo.map(score => parseInt(score['Total Runs']));

        runsInOverTeamOne = ballRunsInOverTeamOne.reduce((partialSum, a) => partialSum + a, 0)
        runsInOverTeamTwo = ballRunsInOverTeamTwo.reduce((partialSum, a) => partialSum + a, 0)

        scoreSheet = {
            'Over': over
        }

        scoreSheet[`teamOneRuns`] = runsInOverTeamOne
        scoreSheet[`teamTwoRuns`] = runsInOverTeamTwo
        scoreSheet['teamOne'] = keys[0]
        scoreSheet['teamTwo'] = keys[1]

        finalScoreSheet.push(scoreSheet)
    }

    $(document).ready(function () {
        $("#nav-item li").click(function () {
            selectedTeam = this.id

            d3.selectAll("#teams > svg").remove();
            generateTeams(selectedTeam)

            d3.selectAll("#scatterPlot > svg").remove();
            d3.selectAll("#scatterPlot > select").remove();
            d3.selectAll("#scatterPlot > span").remove();
            d3.selectAll("#scatterPlot > br").remove();
            generateScatterPlot(masterArray,selectedTeam)

            d3.selectAll("#table > svg").remove();
            generateTable(masterArray,selectedTeam)
            attachSortHandlers(selectedTeam)
            
            d3.selectAll("#scorecard > svg").remove();
            render(finalScoreSheet,seasonMaster,selectedTeam);
            
            d3.selectAll("#pointsHistory > svg").remove();
            d3.selectAll("#pointsHistory > select").remove();
            d3.selectAll("#pointsHistory > span").remove();
            d3.selectAll("#pointsHistory > br").remove();
            generatePoints(data[4],selectedTeam)
        });
    })

    generateTeams('none')
    generateScatterPlot(masterArray,'none')
    generateTable(masterArray,'none')
    attachSortHandlers('none')
    render(finalScoreSheet,seasonMaster,'none');
    generatePoints(data[4],'none')
})