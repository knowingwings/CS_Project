import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Teams"); 
    };
    
    async getHtml() { // html to be inserted
        const func = this.params.func;
        const id = this.params.id;
        const reqURL = '/requestTeamDat';
        if(func == 'edit' ){
            var dat;
            const dataToSend = JSON.stringify({ID: id});
            console.log(dataToSend)
            const fetchData = this.postData(reqURL, dataToSend)
                .then(data => {
                    dat = data;
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
            return `<h1>ORGANISE</h1>`
        }
        else{
            class teamForm {
                constructor(name, buzzword){
                    this.name = name;
                    this.buzzword = buzzword;
                }

                template(){
                    return '<form class="teamContainer" id="'+ this.name + '> <h1>' + this.name + '</h1>'
                }
            }
            //TODO:
            // - Send request to server first checking for teams in the database
            // - recieved data should be the html for the page
            return `
                <h1>Teams</h1>
                <div id="teams"> 
                    <form class="teamContainer" id="addNew">
                        <h1 id="teamName">ADD NEW TEAM</h1>
                        <img id="addButton" src="https://img.icons8.com/ios/250/ffffff/plus--v1.png" onclick="location.href='teams/new/0'"/>
                    </form>
                </div>
            `;
        }
    };
}   