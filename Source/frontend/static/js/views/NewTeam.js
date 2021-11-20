import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Teams"); 
    };

    async getHtml() { // html to be inserted
        return `
            <h1>Teams</h1>
            <form class="teamContainer" id="addingNew" action="addingTeam" method="POST">
            <h1 id="teamName">ADD NEW TEAM</h1>
            <input type="text" name="teamName" value="" placeholder="Team Name">
            <input type="text" name="teamBuzzword" value="" placeholder="Buzzword">
            <input type="submit" value="Add">
            </form>
        `;
    };
}   