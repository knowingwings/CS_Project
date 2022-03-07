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
                    var template = '<h1> Edit </h1> <form class="teamContainer" id="editMainMenu"> <h1>Team: ' + dat.name + '</h1> </form>';
                    return template;
                })
            return await fetchData;
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
                constructor(name, buzzword, id, matches){
                    this.name = name;
                    this.buzzword = buzzword;
                    this.id = id;
                    this.matches = matches;
                }

                template(){
                    if(this.matches==undefined){
                        return '<form class="teamContainer" id="'+ this.id + '"> <h1>' + this.name + `</h1> <input type="button" value="EDIT" onclick="location.href='teams/edit/`+ this.id + `'"> <input type="button" value="ORGANISE MATCH" onclick="location.href='teams/organise/`+ this.id + `'"> </form>`
                    }
                    else{
                        return '<form class="teamContainer" id="'+ this.id + '"> <h1>' + this.name + `</h1> <input type="button" value="EDIT" onclick="location.href='teams/edit/`+ this.id + `'"> <input type="button" value="VIEW MATCH" onclick="location.href='response/viewResponses/`+ this.matches.id + `'"> </form>`;
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
                for (let i=1; i< numOfTeams; i++) {
                    var teamid = data.ids[i-1];
                    const teamDatFetch = this.postData(reqURL, JSON.stringify({type:"TeamDat", teamid}))
                    .then(data => {
                        return data;
                    })
                    var dat = await teamDatFetch;
                    var tempName = dat.name;
                    var tempBuzzword = dat.buzzword;
                    var temp = new teamForm(tempName, tempBuzzword, teamid);
                    htmlForms[i] = temp.template();
                    }
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
                    <div id="slot1">`+ htmlForms[teamsPos-1] + `</div>
                    <div id="slot2">`+ htmlForms[teamsPos] + `</div>
                    <div id="slot3">`+ htmlForms[teamsPos+1] + `</div>
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