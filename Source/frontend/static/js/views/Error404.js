import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Page Not Found"); 
    }

    async getHtml() { // html to be inserted
        return `
            <h1 id="error">Error:404</h1>
        `;
    }
}