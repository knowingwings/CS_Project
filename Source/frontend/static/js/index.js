import Splash from "./views/Splash.js"; 
import Teams from "./views/Teams.js";
import Error404 from "./views/Error404.js";
import Login from "./views/Login.js";
import Register from "./views/Register.js";
import Response from "./views/Response.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => { //prevents page refresh every time a link is pressed
    history.pushState(null, null, url);
    router();
};

const router = async () => { //async funtion to load page views
    const routes = [
        {path: "/404", view: Error404 },
        {path: "/", view: Splash}, // when the route = "/" runs function
        {path: "/login", view: Login },
        {path: "/register", view: Register },
        {path: "/teams", view: Teams },
        {path: "/teams/:func/:id", view: Teams },
        {path: "/response/:func/:id", view: Response},
        {path: "/newmatch", view: () => console.log("Viewing newmatch") },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));
    
    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => { // when the DOM content is loaded router function is run
    document.body.addEventListener("click", e => { //onclick in delegated listener, allows for more links to be added to injected html
        if (e.target.matches("[data-link]")) {
            e.preventDefault(); //stops the default functionality of the element
            navigateTo(e.target.href); //runs the nav function using the href as the url 
        }
    })
    router();
});