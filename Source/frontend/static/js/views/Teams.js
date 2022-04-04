import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Teams"); 
    };
    
    async getHtml() { // html to be inserted
        const func = this.params.func;
        const id = this.params.id;
        const reqURL = '/request';
        var htmlForms;
        var teamsPos;
        if(func == 'edit' ){
            const dataToSend = JSON.stringify({type: "TeamDat",teamid: id});
            const fetchData = this.postData(reqURL, dataToSend)
                .then(data => {
                    var dat = data;
                    
                    return dat;
                })
            const data = await fetchData;
            var template = `<h1> Edit </h1>
            <form class="box" id="editMainMenu">
            <h1>Edit: ` + data.name + `</h1>
            <input type="button" value="ADD MEMBER" onclick="location.href='../addMember/`+ id +`'">
            <p></p>
            <input type="button" value="ADD RIFLE" onclick="location.href='../addRifle/`+ id +`'">
            <p></p>
            <input type="button" value="EDIT MEMBER" onclick="location.href='../editMember/`+ id +`'">
            <p></p>
            <input type="button" value="REMOVE RIFLE" onclick="location.href='../removeRifle/`+ id +`'">
            </form>`;
            return template;
        }
        else if(func == 'addMember'){
            const fetchTeamData = this.postData(reqURL, JSON.stringify({type: "TeamDat","teamid": id}))
                    .then(data=> {
                        return data;
                    })
            var teamDat = await fetchTeamData;

            // Name drop down
            var rDropdownElements = [];
            for(let i=0;i<teamDat.rifles.length;i++){
                rDropdownElements[i] = `<option style="bg-color:gray;" value="`+ teamDat.rifles[i] +`">`+ teamDat.rifles[i] +`</option>`
            };

            var rDropdown = `<select name="rifle" id="rifle">`;
            for(let j=0;j<teamDat.rifles.length;j++){
                
                if(j==teamDat.rifles.length){
                    rDropdown = rDropdown.concat(rDropdownElements[j]);
                }
                else{
                    rDropdown = rDropdown.concat(rDropdownElements[j]);
                };
            }
            
            return `<form class="box" id="addMember" action="../addMember" method="POST">
            <h1>Add Member</h1>
            <input type="text" name="teamID" value="`+ id +`" style="display:none;">
            <input type="text" name="date" value="0000-00-00" style="display:none;">
            <input type="text" name="endTime" value="00:00" style="display:none;">
            <label for="memName">Name:</label>
            <input type="text" name="memName">
            <label for="rifle">Rifle Number</label>
            `+ rDropdown +`
            </select>
            <label for="coached"> Coached? </label>
            <input type="checkbox" id="coached" name="coach">
            <p></p>
            
            <input type="submit" value="Add Member">
            </form>`
        }

        else if(func == 'addRifle'){
            return `<form class="box" id="addRifle" action="../addRifleFunc" method="POST">
            <h1>Add Rifle</h1>
            <input type="text" name="teamID" value="`+ id +`" style="display:none;">
            <label for="rifleNum"> Rifle Number: </label>
            <input type="text" name="rifleNum"> 
            <input type="submit" value="Add Rifle">
            </form>`
        }

        else if(func == 'editMember'){
            const fetchTeamData = this.postData(reqURL, JSON.stringify({type: "TeamDat","teamid": id}))
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

            var tMDropdown = `<select name="members" id="members_id" required>`;
            for(let j=0;j<teamDat.teamMembers.length;j++){
                
                if(j==teamDat.teamMembers.length){
                    tMDropdown = tMDropdown.concat(tMDropdownElements[j]);
                    tMDropdown = tMDropdown.concat("</select>")
                }
                else{
                    tMDropdown = tMDropdown.concat(tMDropdownElements[j]);
                };
            }

            // Name drop down
            var rDropdownElements = [];
            for(let i=0;i<teamDat.rifles.length;i++){
                rDropdownElements[i] = `<option style="bg-color:gray;" value="`+ teamDat.rifles[i] +`">`+ teamDat.rifles[i] +`</option>`
            };

            var rDropdown = `<select name="rifle" id="rifle">`;
            for(let j=0;j<teamDat.rifles.length;j++){
                
                if(j==teamDat.rifles.length){
                    rDropdown = rDropdown.concat(rDropdownElements[j]);
                }
                else{
                    rDropdown = rDropdown.concat(rDropdownElements[j]);
                };
            }

            return `<form class="box" id="editMember" action="../editMemberFunc/" method="POST">
            <h1>Edit Member</h1>
            <p> Input current data as well as new data </p>
            <input type="text" name="teamID" value="`+ id +`" style="display:none;">
            `+ tMDropdown +`</select>
            <label for="memName">Name:</label>
            <input type="text" name="memName">
            <label for="rifle">Rifle Number</label>
            `+ rDropdown +`
            </select>
            <label for="coachedBool"> Coached? </label>
            <input type="checkbox" id="coachedBool" name="coachedBool">
            <p></p>
            <input type="submit" value="Apply Changes">
            </form>`
        }

        else if(func == 'removeRifle'){
            return `<form class="box" id="removeRifle" action="../removeRifleFunc" method="POST">
            <h1>Remove Rifle</h1>
            <input type="text" name="teamID" value="`+ id +`" style="display:none;">
            <label for="rifleNum"> Rifle Number: </label>
            <input type="text" name="rifleNum"> 
            <input type="submit" value="Remove Rifle">
            </form>`
        }
        else if(func == 'new'){
            return `
            <h1>Teams</h1>
            <form class="teamContainer" id="addingNew" action="addingTeam" method="POST">
            <h1 id="teamName">ADD NEW TEAM</h1>
            <input type="text" name="teamName" value="" placeholder="Team Name">
            <input type="text" name="teamBuzzword" value="" placeholder="Buzzword">
            <input type="submit" value="Add">
            </form>
            `
        }
        else if(func == 'organise'){
            class teamObj {
                constructor(name, buzzword, id, teamMembers){
                    this.name = name,
                    this.buzzword = buzzword,
                    this.id = id,
                    this.teamMembers = teamMembers
                }

                output(){
                    return `<form class="box" id="organise" action="./createMatch" method="POST"> <h1>Organise Match For ` + this.name + ` </h1> 
                    <label for="date">Date:</label>
                    <input type="date" id="date" name="date" required>
                    <label for="startTime">Starting Time:</label>
                    <input type="time" id="startTime" name="startTime" required>
                    <label for="endTime">Ending Time:</label>
                    <input type="time" id="endTime" name="endTime" required>
                    <input type="text" id='teamID' value='`+ this.id + `' name="teamID" style="display:none;">
                    <input type="submit" value="COMPLETE"> </form>`
                }
            }
            const teamDatFetch = this.postData(reqURL, JSON.stringify({type:"TeamDat", teamid: id}))
                    .then(data => {
                        return data;
                    })
            var datReq = await teamDatFetch;
            var team = new teamObj(datReq.name, datReq.buzzword, id, datReq.teamMembers);
            return `<h1>ORGANISE</h1>` + team.output();


        }
        else{
            const dataToSend = JSON.stringify({type: "TeamNum"});
            var numOfTeams;
            htmlForms = [`<form class="teamContainer" id="addNew">
            <h1 id="teamName">ADD NEW TEAM</h1>
            <img id="addButton" src="https://img.icons8.com/ios/250/ffffff/plus--v1.png" onclick="location.href='teams/new/0'"/>
            </form>`];

            class teamForm {
                constructor(name, buzzword, id, match, matchID){
                    this.name = name;
                    this.buzzword = buzzword;
                    this.id = id;
                    this.matches = match;
                    this.matchId = matchID;
                }

                template(){
                    if(this.matches == undefined){
                        return '<form class="teamContainer" id="'+ this.id + `">
                        <h1>` + this.name + `</h1>
                            <input type="button" value="EDIT" onclick="location.href='./edit/`+ this.id + `'">
                            <input type="button" value="ORGANISE MATCH" onclick="location.href='teams/organise/`+ this.id + `'">
                            <p>No Active Match</p>
                            <p id="buzzword" name="buzzword"> Buzzword: `+ this.buzzword +`</p>
                        </form>`
                    }
                    else{
                        return `<form class="teamContainer" id="`+ this.id + `"> 
                            <h1>` + this.name + `</h1> <input type="button" value="EDIT" onclick="location.href='teams/edit/`+ this.id + `'">
                            <input type="button" value="ORGANISE MATCH" onclick="location.href='teams/organise/`+ this.id + `'"> 
                            <input type="button" value="VIEW MATCH" onclick="location.href='response/viewResponses/`+ this.matchId + `'"> 
                            <p id="buzzword"> Buzzword: `+ this.buzzword +`</p>
                            <h2>Current Match Information:</h2>
                            <p id="matchDate"> ` + this.matches.date +`</p> 
                            <p id="matchStart"> Start Time: ` + this.matches.startTime +`</p>
                            <p id="matchEnd"> End Time: `+ this.matches.endTime +`</p>
                        </form>`;
                    }
                    
                }
            }
            const fetchNum = this.postData(reqURL, dataToSend)
                .then(data => {
                    return data;
                })
            var data= await fetchNum;

            numOfTeams = data.number;

            if(await numOfTeams>0){
                for (let i=0; i< numOfTeams; i++) {
                    var teamid = data.ids[i];
                    const teamDatFetch = this.postData(reqURL, JSON.stringify({type:"TeamDat", teamid}))
                    .then(data => {
                        return data;
                    })
                    var dat = await teamDatFetch;
                    var tempName = dat.name;
                    var tempBuzzword = dat.buzzword;
                    var tempMatch = dat.match;
                    var matchID = dat.matchId;
                    var temp = new teamForm(tempName, tempBuzzword, teamid, tempMatch, matchID);
                    htmlForms[i+1] = temp.template();
                }
                console.log(htmlForms);
                teamsPos=1
                var templateDat = `
                <h1>Teams</h1>
                <script>
                var htmlForms = [` + htmlForms +`];
                var teamsPos = 0;
                function cycle(dir){
                    if(dir=="left")
                        if(teamsPos>1){
                            teamsPos--;
                            document.getElementById("slot1").innerHTML(htmlForms[teamsPos-1]);
                            document.getElementById("slot2").innerHTML(htmlForms[teamsPos]);
                            document.getElementById("slot3").innerHTML(htmlForms[teamsPos+1]);
                        }
                        else{}
                    else if (dir=="right")
                        if(teamsPos+1<numOfTeams){
                            teamsPos++;
                            document.getElementById("slot1").innerHTML(htmlForms[teamsPos-1]);
                            document.getElementById("slot2").innerHTML(htmlForms[teamsPos]);
                            document.getElementById("slot3").innerHTML(htmlForms[teamsPos+1]);   
                        }
                        else{}
                    else{
                        console.log("Invalid Param")
                    }
                }
                </script>
                <img id="leftArrow" src="https://img.icons8.com/ios-filled/100/ffffff/chevron-left.png"/ onclick="cycle('left')">
                <div id="slot1">`+ htmlForms[0] + `</div>
                <div id="slot2">`+ htmlForms[1] + `</div>
                <div id="slot3">`+ htmlForms[2] + `</div>
                <img id="rightArrow" src="https://img.icons8.com/ios-filled/100/ffffff/chevron-right.png"/ onclick="cycle('right')">
                `;
                return templateDat;
                }
                else {
                    console.log("No teams found")
                    return htmlForms[0];
                };
        }
    };
}   