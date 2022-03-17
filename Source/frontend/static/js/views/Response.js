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
            return `
            <h1>Viewing detail</h1>`
        }
    }
}