import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Splash"); 
    };

    async getHtml() { // html to be inserted
        return `
            <h1>SPLASH</h1>
        `;
    };
}   