import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login"); 
    }

    async getHtml() { // html to be inserted
        return `
        <form class="box" id="loginForm" style="display:block;" action="loginAttempt" method="POST">
            <h1>Login</h1>
            <input type="text" name="username" value="" placeholder="Username" id="usernameLogin">
            <input type="password" name="password" value="" placeholder="Password" id="passwordLogin">
            <input type="submit" name="" value="Login">
            <a class="nav__link" data-link href="/register" id="registerLink" >Don't have an account?</a>
        </form>
        `;
    }
}