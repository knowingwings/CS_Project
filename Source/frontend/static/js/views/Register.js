import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Register"); 
    }

    async getHtml() { // html to be inserted
        return `
        <form class="box" id="registerForm" style="display:block;" action="registerAttempt" method="POST">
            <h1>Register</h1>
            <input type="text" name="username" value="" placeholder="Username" id="usernameRegister">
            <input type="password" name="password" value="" placeholder="Password" id="passwordRegister">
            <input type="submit" name="" value="Register">
            <a href="/login" class="nav__link" data-link id="loginReturn">Already have an account?</a>
        </form>
        `;
    }
}