import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Teams"); 
    };

    async getHtml() { // html to be inserted
        return `
            <h1>Teams</h1>
            <form class="teamContainer" id="addNew">
            <h1 id="teamName">ADD NEW TEAM</h1>
            <img id="addButton" src="https://img.icons8.com/ios/250/ffffff/plus--v1.png" onclick="location.href='/newteam'"/>
            
            </form>
        `;
    };
}   