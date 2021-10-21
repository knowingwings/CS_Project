import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Teams"); 
    };

    async getHtml() { // html to be inserted
        return `
            <h1>Teams</h1>
        `;
    };
}   