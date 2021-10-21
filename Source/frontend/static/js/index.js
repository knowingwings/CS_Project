import Splash from "./views/Splash.js"; 
import Teams from "./views/Teams.js";

const navigateTo = url => { //prevents page refresh every time a link is pressed
    history.pushState(null, null, url);
    router();
};

const router = async () => { //async funtion to load page views
    const routes = [
        {path: "/404", view: () => console.log("Viewing 404") },
        {path: "/", view: () => Splash }, // when the route = "/" runs function
        {path: "/login", view: () => console.log("Viewing login") },
        {path: "/register", view: () => console.log("Viewing register") },
        {path: "/teams", view: () => Teams },
        {path: "/newteam", view: () => console.log("Viewing newteam") },
        {path: "/newmatch", view: () => console.log("Viewing newmatch") },
    ];

    //test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) { // if no match is found routes to a 404 page
        match = {
            route: routes[0],
            isMatch: true
        };
    }

    const view = new match.route.view();

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