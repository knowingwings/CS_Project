import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login"); 
    }

    async getHtml() { // html to be inserted
        return `
        <form class="box" id="loginForm" style="display:block;">
            <h1>Login</h1>
            <input type="text" name="" value="" placeholder="Username" id="usernameLogin">
            <input type="password" name="" value="" placeholder="Password" id="passwordLogin">
            <input type="button" name="" value="Login">
            <input type="button" name="" value="Register" data-link href="/register">
        </form>
        `;
    }
}