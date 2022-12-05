let selectedTeam = []

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

        battingObject = data[1].filter(batting => batting['Player'] === data[0][row]['Player'])

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

    groupedPointsData = data[4].reduce((group, score) => {
        const { Teams } = score;
        group[Teams] = group[Teams] ?? [];
        group[Teams].push(score);
        return group;
    },
        {});

    const teams = Object.keys(groupedPointsData);

    pointsArray = []
    for (let team in teams) {
        let wins = 0
        let i = 1
        let losses = 0
        for (let match in groupedPointsData[teams[team]]) {
            tempObject = {}
            if (groupedPointsData[teams[team]][match]['Wins'] > wins || groupedPointsData[teams[team]][match]['Losses'] > losses) {
                wins = groupedPointsData[teams[team]][match]['Wins']
                losses = groupedPointsData[teams[team]][match]['Losses']
                tempObject['Match'] = i
                tempObject['Team'] = teams[team]
                tempObject['Position'] = groupedPointsData[teams[team]][match]['Position']
                tempObject['Wins'] = groupedPointsData[teams[team]][match]['Wins']
                tempObject['Losses'] = groupedPointsData[teams[team]][match]['Losses']
                tempObject['NRR'] = groupedPointsData[teams[team]][match]['NRR']
                pointsArray.push(tempObject)
            }
            i++
        }
    }

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
            clickedTeam = this.id

            let shortNames = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PK", "RCB", "RR", "SRH"]
            let teamsNames = ["Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders", "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Royal Challengers Bangalore", "Rajasthan Royals", "Sunrisers Hyderabad"]
            let homeStadiums = ["M.A.Chidambaram Stadium", "Arun Jaitley Ground", "Narendra Modi Stadium", "Eden Gardens", "Shri Atal Bihari Vajpayee Ekana Cricket Stadium", "Wankhede Stadium", "PCA Stadium", "M.Chinnaswamy Stadium", "Sawai Mansingh Stadium", "Rajiv Gandhi International Cricket Stadium"]
            let yearFounded = ["2008", "2008", "2021", "2008", "2021", "2008", "2008", "2008", "2008", "2012"]
            let trophiesWon = ["4", "0", "1", "2", "0", "5", "0", "0", "1", "2"]
            let fansWorldwide = ["32.8M", "13.8M", "2.6M", "25.1M", "2M", "32.2M", "14.2M", "25.7M", "10.2M", "12.2M"]
            let promPlayer = ["MS Dhoni", "Virender Sehwag", "Hardik Pandya", "Gautham Gambhir", "KL Rahul", "Rohit Sharma", "Yuvraj Singh", "Virat Kohli", "Shane Warne", "David Warner"]

            for (let i = 0; i < 10; i++) {
                if (clickedTeam == shortNames[i]) {
                    varTeam = teamsNames[i]
                    home = homeStadiums[i]
                    year = yearFounded[i]
                    trophies = trophiesWon[i]
                    prom = promPlayer[i]
                    fans = fansWorldwide[i]
                }
            }

            let varTeamSelected = this.id
            let findTeam = selectedTeam.find(function (ele) {
                return ele == varTeamSelected
            })

            if (!findTeam) {
                selectedTeam.push(varTeamSelected)
            }

            let iplData = document.querySelectorAll("h5")

            iplData[0].innerText = "Home Stadium: " + home
            iplData[1].innerText = "Founded In: " + year
            iplData[2].innerText = "Trophies: " + trophies
            iplData[3].innerText = "Most Promiment Player is History: " + prom
            iplData[4].innerText = "Fans Worldwide: " + fans

            if (this.id == 'clear') {
                selectedTeam = []
                fullSelectedTeams = []

                iplData[0].innerText = "Home Stadium: "
                iplData[1].innerText = "Founded In: "
                iplData[2].innerText = "Trophies: "
                iplData[3].innerText = "Most Promiment Player is History: "
                iplData[4].innerText = "Fans Worldwide: "
            }

            d3.selectAll("#teams > svg").remove();
            generateTeams(selectedTeam)

            d3.selectAll("#scatterPlot > svg").remove();
            d3.selectAll("#scatterPlot > select").remove();
            d3.selectAll("#scatterPlot > span").remove();
            d3.selectAll("#scatterPlot > br").remove();
            d3.selectAll("#scatterLegend > svg").remove();
            generateScatterPlot(masterArray, selectedTeam)

            d3.selectAll("#scorecard > svg").remove();
            d3.selectAll("#scorecard > select").remove();
            d3.selectAll("#scorecard > span").remove();
            d3.selectAll("#scorecard > br").remove();
            generateScorecard(seasonMaster);

            d3.selectAll("#pointsHistory > svg").remove();
            d3.selectAll("#pointsHistory > select").remove();
            d3.selectAll("#pointsHistory > span").remove();
            d3.selectAll("#pointsHistory > br").remove();
            d3.selectAll("#pointsHistory > option").remove();
            generatePoints(data[4], seasonMaster, selectedTeam, pointsArray)
        });

    })

    generateTeams([])
    generateScatterPlot(masterArray, [])
    generateScorecard(seasonMaster);
    generatePoints(data[4], seasonMaster, [], pointsArray)
})