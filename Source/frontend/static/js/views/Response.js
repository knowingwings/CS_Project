import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login"); 
    }

    async getHtml() { // html to be inserted
        const func = this.params.func;
        const ID = this.params.id;
        const reqURL = '/request';

        if(func=="share"){
            return `<form class="box" id="share" action="/shareComplete" method="POST">
                    <h1> Share </h1>
                    <label for="myInput">Share Link:</label>
                    <button onclick="prompt('Press Ctrl + C, then Enter to copy to clipboard','localhost:2040/response/reply/`+ ID +`')">Copy Link</button>
                    </form>
            `;
        }
        else if(func=="reply"){
            
            const fetchMatchTeam = this.postData(reqURL, JSON.stringify({type: "matchTeamID", "id": ID}))
                    .then(data => {
                        return data;
                    })
            var matchDat = await fetchMatchTeam;
            var teamId = matchDat.teamID;
            
            const fetchTeamData = this.postData(reqURL, JSON.stringify({type: "TeamDat","teamid": teamId}))
                    .then(data=> {
                        return data;
                    })
            var teamDat = await fetchTeamData;
            
            // Name drop down
            console.log(teamDat.teamMembers);
            var tMDropdownElements = [];
            for(let i=0;i<teamDat.teamMembers.length;i++){
                tMDropdownElements[i] = `<option value="`+ teamDat.teamMembers[i].name +`">`+ teamDat.teamMembers[i].name +`</option>`
            };

            var tMDropdown = `<select name="members" id="members_id">`;
            for(let j=0;j<teamDat.teamMembers.length;j++){
                
                if(j==teamDat.teamMembers.length){
                    tMDropdown = tMDropdown.concat(tMDropdownElements[j]);
                    tMDropdown = tMDropdown.concat("</select>")
                }
                else{
                    tMDropdown = tMDropdown.concat(tMDropdownElements[j]);
                };
            }
            return `<form class="box" id="reply" action="./send" method="POST">
                <h2>`+ teamDat.name+` match </h2>
                <p id="date"><span> Date of shoot:</span> `+ matchDat.date +`</p>
                <input type="text" name="date" value="`+ matchDat.date +`" style="display:none;">
                <p id="startTime"> Start time: `+ matchDat.startTime +`</p>
                <input type="text" name="startTime" value="`+ matchDat.startTime +`" style="display:none;">
                <p id="endTime" ><span>End time: </span>`+ matchDat.endTime + `</p>
                <input type="text" name="endTime" value="`+ matchDat.endTime +`" style="display:none;">
                <input type="time" id="leaveTime" value="`+ matchDat.endTime +`" name="leaveTime">
                <label for="members">Name: </label>
                `+ tMDropdown +`
                <input type="text" id="teamID" name="teamID" value="`+ matchDat.teamID +`" style="display:none;">
                <input type="text" name="buzzword" value="Buzzword" style="align:centre;">
                <input type="submit" value="Complete" style="align:centre;">
            </form>`
        }
        else if(func=="viewResponses"){
            const fetchMatchTeam = this.postData(reqURL, JSON.stringify({type: "matchTeamID", "id": ID}))
                .then(data => {
                    return data;
                })
            var matchDat = await fetchMatchTeam;
            var teamId = matchDat.teamID;
    
            const fetchTeamData = this.postData(reqURL, JSON.stringify({type: "TeamDat","teamid": teamId}))
                .then(data=> {
                    return data;
                })
            var teamDat = await fetchTeamData;
            return `
            <form class="box" id="organise" action="./createDetail" method="POST">
                <h1>Organise Detail</h1>
                <h2 id="teamName">`+ teamDat.name +`</h2>
                <p> Number of Responses: `+ teamDat.teamMembers.length /*Currently uses team member length as there is no num of responses record*/+`</p> 
                <div class="slidecontainer">
                    <label for="detailNum"> Number of details: </label>
                    <input type="range" min="3" max="15" value="7" class="slider" id="detailNum" name="detailNum">
                </div>
                <div class="slidercontainer">
                    <label for="targetNum"> Number of targets: </label>
                    <input type="range" min="1" max="10" value="5" class="slider" id="targetNum" name="targetNum">
                </div>
                <label for="targSharing"> Target sharing? </label>
                <input type="checkbox" id="targSharing" name="targSharing">
                <p></p>
                <input type="text" id="teamID" value="`+ teamId +`" style="display:none;" name="teamID">
                <input type="Submit" value="COMPLETE">
             </form>`
        }
        else if(func=="viewDetail"){
            const fetchDetail = this.postData(reqURL, JSON.stringify({type: "getDetail"}))
            .then(data => {
                return data;
            })
            const detailDat = await fetchDetail;
            var firing = detailDat.firing;
            var prep = detailDat.prep;
            var butts = detailDat.butts;
            var numOfDetail = detailDat.detail;
            var numOfTargets = detailDat.numOfTargets;
            var numOfLanes = detailDat.numOfLanes;
            var firingRow = [];
            var prepRow = [];
            var buttsRow = [];
            var tableTemplate = `
            <table style="border: 1px solid white;">
                <thead style="border: 1px solid white;">
                    <tr style="border: 1px solid white; background:black;">
                        <th colspan="6" style="text-align: center">Name</th>
                        <th colspan="6" style="text-align: center">Rifle</th>
                        <th colspan="6" style="text-align: center">Target</th>
                        <th colspan="6" style="text-align: center">1st detail Info</th>
                        <th colspan="6" style="text-align: center">Coach</th>
                        <th colspan="6" style="text-align: center">Order of Duties</th>
                    </tr>
                </thead>
                <tbody style="border: 1px solid white;">`
            for(let i=0; i<firing.length; i++){
                var name = firing[i].name;
                var rifle = firing[i].rifle;
                if(numOfLanes==numOfTargets){
                    var targetNum = i+1;
                    firingRow[i] = `
                    <tr style="border: 1px solid white; background:green;">
                        <td colspan="6" style="text-align: center">    `+ name +`    </td>
                        <td colspan="6" style="text-align: center">`+ rifle +`</td>
                        <td colspan="6" style="text-align: center">`+ targetNum +`</td>
                        <td colspan="6" style="text-align: center"> Firing </td>
                        <td colspan="6" style="text-align: center">  </td>
                        <td colspan="6" style="text-align: center"> Firing, Butts, Prep </td>
                    </tr>`
                }
                else{
                    if(this.isEven(i)){
                        var targetNum = i+1;
                    }
                    else{
                        var targetNum = i;
                    }
                    firingRow[i] = `
                    <tr style="border: 1px solid white; background:green;">
                        <td colspan="6" style="text-align: center">    `+ name +`    </td>
                        <td colspan="6" style="text-align: center">`+ rifle +`</td>
                        <td colspan="6" style="text-align: center">`+ targetNum +`</td>
                        <td colspan="6" style="text-align: center"> Firing </td>
                        <td colspan="6" style="text-align: center">  </td>
                        <td colspan="6" style="text-align: center"> Firing, Butts, Prep </td>
                    </tr>`
                }
            }

            for(let j=0; j<prep.length; j++){
                var name = prep[j].name;
                var rifle = prep[j].rifle;
                if(numOfLanes==numOfTargets){
                    var targetNum = j+1;
                    prepRow[j] = `
                    <tr style="border: 1px solid white; background:gray;">
                        <td colspan="6" style="text-align: center">`+ name +`</td>
                        <td colspan="6" style="text-align: center">`+ rifle +`</td>
                        <td colspan="6" style="text-align: center">`+ targetNum +`</td>
                        <td colspan="6" style="text-align: center"> Prep </td>
                        <td colspan="6" style="text-align: center">  </td>
                        <td colspan="6" style="text-align: center"> Prep, Firing, Butts </td>
                    </tr>`
                }
                else{
                    if(this.isEven(j)){
                        var targetNum = j+1;
                    }
                    else{
                        var targetNum = j;
                    }
                    
                    prepRow[j] = `
                    <tr style="border: 1px solid white; background:gray;">
                        <td colspan="6" style="text-align: center">`+ name +`</td>
                        <td colspan="6" style="text-align: center">`+ rifle +`</td>
                        <td colspan="6" style="text-align: center">`+ targetNum +`</td>
                        <td colspan="6" style="text-align: center"> Prep </td>
                        <td colspan="6" style="text-align: center">  </td>
                        <td colspan="6" style="text-align: center"> Prep, Firing, Butts </td>
                    </tr>`
                }
            }

            for(let k=0; k<butts.length; k++){
                var name = butts[k].name;
                var rifle = butts[k].rifle;
                if(numOfLanes==numOfTargets){
                    var targetNum = k+1;
                    buttsRow[k] = `
                    <tr style="border: 1px solid white; background:blue;">
                        <td colspan="6" style="text-align: center">`+ name +`</td>
                        <td colspan="6" style="text-align: center">`+ rifle +`</td>
                        <td colspan="6" style="text-align: center">`+ targetNum +`</td>
                        <td colspan="6" style="text-align: center"> Butts </td>
                        <td colspan="6" style="text-align: center">  </td>
                        <td colspan="6" style="text-align: center"> Butts, Prep, Firing </td>
                    </tr>`
                }
                else{
                    if(this.isEven(k)){
                        var targetNum = k+1;
                    }
                    else{
                        var targetNum = k;
                    }
                    buttsRow[k] = `
                    <tr style="border: 1px solid white; background:blue;">
                        <td colspan="6" style="text-align: center">`+ name +`</td>
                        <td colspan="6" style="text-align: center">`+ rifle +`</td>
                        <td colspan="6" style="text-align: center">`+ targetNum +`</td>
                        <td colspan="6" style="text-align: center"> Butts </td>
                        <td colspan="6" style="text-align: center">  </td>
                        <td colspan="6" style="text-align: center"> Butts, Prep, Firing </td>
                    </tr>`
                }
            }

            for(let m = 0; m<firingRow.length; m++){
                tableTemplate=tableTemplate+(firingRow[m])
            }

            for(let n = 0; n<prepRow.length; n++){
                tableTemplate=tableTemplate+(prepRow[n])
            }

            for(let b = 0; b<buttsRow.length; b++){
                tableTemplate= tableTemplate+(buttsRow[b])
            }

            tableTemplate= tableTemplate+"\n        </tbody>";
            return `<h1>Viewing detail</h1>
            <div class="box" style="width:500px;">
            `+ tableTemplate + `</table>
            </div>
            `;
        }
    }
}