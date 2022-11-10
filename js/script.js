auctionData = d3.csv("./data/AuctionData.csv")
battingData = d3.csv("./data/BattingStatistics.csv")
bowlingData = d3.csv("./data/BowlingStatistics.csv")

Promise.all([auctionData, battingData, bowlingData]).then( data => {
    masterArray = []
    maximumRowSize = [...Array(Math.max(data[0].length, data[1].length, data[2].length)).keys()]
    for(let row in maximumRowSize ){
            let tempObject = {}
                tempObject["player"] = data[0][row]["Player"]
                tempObject["team"] = data[0][row].Team
                tempObject["previousTeam"] = data[0][row]["2021 Squad"]
                tempObject["draft"] = data[0][row]["Retained / Draft Pick"]
                tempObject["price"] = data[0][row]["Cost"]

                battingObject = data[1].filter(batting => batting['Player'] == data[0][row]['Player'])

                tempObject['batInnings'] = battingObject.length != 0 ? parseInt(battingObject[0]["Innings"]) : ''
                tempObject['batMatches'] = battingObject.length != 0 ? parseInt(battingObject[0]["Matches"]) : ''
                tempObject['notOut'] = battingObject.length != 0 ? parseInt(battingObject[0]["Not Out"]) : ''
                tempObject['runs'] = battingObject.length != 0 ? parseInt(battingObject[0]["Runs"]) : ''
                tempObject['highScore'] = battingObject.length != 0 ? battingObject[0]["High Score"] : ''
                tempObject['batAverage'] = battingObject.length != 0 ? parseInt(battingObject[0]["Average"]) : ''
                tempObject['ballsFaced'] = battingObject.length != 0 ? parseInt(battingObject[0]["Balls Faced"]) : ''
                tempObject['strikeRate'] = battingObject.length != 0 ? parseInt(battingObject[0]["strikeRate"]) : ''
                tempObject['centuries'] = battingObject.length != 0 ? parseInt(battingObject[0]["100"]) : ''
                tempObject['fifties'] = battingObject.length != 0 ? parseInt(battingObject[0]["50"]) : ''
                tempObject['foures'] = battingObject.length != 0 ? parseInt(battingObject[0]["4s"]) : ''
                tempObject['sixes'] = battingObject.length != 0 ? parseInt(battingObject[0]["6s"]) : ''

                bowlingObject = data[2].filter(bowling => bowling['Player'] == data[0][row]['Player'])
                tempObject['bowlMatches'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["Matches"]) : ''
                tempObject['bowlInnings'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["Innings"]) : ''
                tempObject['bowlOvers'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["Overs"]) : ''
                tempObject['runsGiven'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["Runs"]) : ''
                tempObject['wicketsTaken'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["Wickets"]) : ''
                tempObject['bowlAverage'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["Average"]) : ''
                tempObject['economy'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["Economy"]) : ''
                tempObject['bowlSR'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["strikeRate"]) : ''
                tempObject['fourW'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["4W"]) : ''
                tempObject['fiveW'] = bowlingObject.length != 0 ? parseInt(bowlingObject[0]["5W"]) : ''

                masterArray.push(tempObject);

            }
            console.log("masterArray",masterArray)
    generateScatterPlot(masterArray);
    generateTable(data[0])

})