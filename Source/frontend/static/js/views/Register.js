import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Register"); 
    }

    async getHtml() { // html to be inserted
        return `
        <form class="box" id="loginForm" style="display:block;">
            <h1>Login</h1>
            <input type="text" name="" value="" placeholder="Username" id="usernameRegister">
            <input type="password" name="" value="" placeholder="Password" id="passwordRegister">
            <input type="button" name="" value="Register" onclick="register();">
        </form>
        `;
    }
}