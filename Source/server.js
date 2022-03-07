const { response } = require("express");
const bcrypt = require('bcrypt');
const express = require("express");
const path = require("path");


//firebase imports
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { utimesSync } = require("fs");
const { collection, query, where, getDocs, doc, setDoc, documentId, updateDoc} = require("firebase/firestore");
//----------------
const bodyParser = require("body-parser");
const { urlToHttpOptions } = require("url");
const { async } = require("@firebase/util");
const { type } = require("os");
const { get } = require("http");
const { json } = require("body-parser");
const { start } = require("repl");
const { match } = require("assert");

const app = express();
const saltRounds = 10;
var loggedUser; //global var of the user logged in
var currentTeam; //global var of the current team

class team { // JSON object class
    constructor(name, buzzword, owner, teamMembers, teamMatches)  {
        this.name= name,
        this.buzzword= buzzword,
        this.owner= owner,
        this.teamMembers= teamMembers,
        this.teamMatches = teamMatches
    }
}

class reqTeamNumObj{
    constructor(number, teamIDS){
        this.number = number,
        this.ids = teamIDS
    }
}

const firebaseConfig = { //firebase config
    apiKey: "AIzaSyCjB13kHrESLrKIz2z3VwevLDvlLS4vX_8",

    authDomain: "eq-manager-cs-proj.firebaseapp.com",
  
    projectId: "eq-manager-cs-proj",
  
    storageBucket: "eq-manager-cs-proj.appspot.com",
  
    messagingSenderId: "97347328589",
  
    appId: "1:97347328589:web:0dd1057a80d0136dbf1a04",
  
    measurementId: "G-0XL3Z59GEQ"
  
};

initializeApp(firebaseConfig);
const db = getFirestore();

//collections
const userDb = collection(db, "users");
const teamDb = collection(db, "teams");
const tmembersDb = collection(db, "teamMembers");
const matchDb = collection(db, "matches");

app.use("/static", express.static(path.resolve(__dirname,"frontend", "static")));
var urlencodedParser =  bodyParser.urlencoded({extended: true});
var jsonParser = bodyParser.json();

app.get("/*", urlencodedParser, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html")); //display index.html in the frontend directory as the webpage
});

app.listen(process.env.PORT || 2040, () => console.log("Server running...")); //outputs that the server is running in terminal and runs the server through port 2040

// ----------------------------    MISC FUNCTIONS   -----------------------------------------------

async function hashPhrase(plaintext) {
  try {
    const hash = await bcrypt.hash(plaintext, saltRounds);
    return hash;
  } catch (err) {
    console.error('There was an error ', err);
  }
}

async function compareHash(plaintext, dbText) {
    const match = await bcrypt.compare(plaintext, dbText);
    return match;
}

function validatePassword(p) {
    const errors = [];
    if (p.length < 8) {
        errors.push("Your password must be at least 8 characters");
    }
    if (p.length > 32) {
        errors.push("Your password must be at max 32 characters");
    }
    if (p.search(/[a-z]/) < 0) {
        errors.push("Your password must contain at least one lower case letter."); 
    }
    if (p.search(/[A-Z]/) < 0) {
        errors.push("Your password must contain at least one upper case letter."); 
    }

    if (p.search(/[0-9]/) < 0) {
        errors.push("Your password must contain at least one digit.");
    }
   if (p.search(/[!@#\$%\^&\*_]/) < 0) {
        errors.push("Your password must contain at least special char from -[ ! @ # $ % ^ & * _ ]"); 
    }
    if (errors.length > 0) {
        return errors.join("\n");
    }
    return true;
};

function validateBuzzword(b){
    const errors = [];
    if (b.length < 6) {
        errors.push("Your buzzword must be at least 6 characters");
    }
    if (b.length > 32) {
        errors.push("Your buzzword must be at max 32 characters");
    }
    if (b.search(/[a-z]/) < 0) {
        errors.push("Your buzzword must contain at least one lower case letter."); 
    }
    if (b.search(/[A-Z]/) < 0) {
        errors.push("Your buzzword must contain at least one upper case letter."); 
    }

    if (b.search(/[0-9]/) < 0) {
        errors.push("Your buzzword must contain at least one digit.");
    }
   if (b.search(/\W/) > 0) {
        errors.push("Your buzzword cannot contain any special characters"); 
    }
    if (errors.length > 0) {
        return errors.join("\n");
    }
    return true;
}
// ----------------------------------   FIRESTORE FUNCTIONS    -------------------------------------

async function searchUsername(username){
    try{
        var uData;
        const q = query(userDb, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
           uData = doc.data();
           loggedUser = doc.id;
        });
        return uData;
        }
    catch(err){
            console.log(err);
        }
};

async function searchTeamName(teamName){
    try{
        var tData;
        const q = query(teamDb, where("name", "==", teamName) && where("owner", "==", loggedUser));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
           tData = doc.data();
           currentTeam = doc.id;
        });
        return tData;
        }
    catch(err){
            console.log(err);
        }
}

async function getTeamDat(teamID){
    try{
        var tData;
        const q = query(teamDb,where(documentId(), "==", teamID));
        const retrieval = await getDocs(q);
        retrieval.forEach((doc) => tData = doc.data());
        return tData;
    }
    catch(err){
            console.log(err);
        }
}


async function fetchTeamMembers(teamID) {
    try{
        var fetchedData = [];
        var i = 0;
        const q = query(tmembersDb, where("teamID", "==", teamID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=> {
            fetchedData[i] = doc.data();
            i++;
        });
        return fetchedData;
    }
    catch(err){
        console.log(err);
    }
}

async function getTeamNum(ownerID) {
    try{
        var numOfTeams;
        var k = 0;
        const q = query(teamDb, where("owner", "==", ownerID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(()=> {
            k++;
            numOfTeams=k;
        });
        return numOfTeams;
    }
    catch(err){
        console.log(err);
    }
    
}

async function getTeamIDs(ownerID) {
    try{
        var j = 0;
        var fetchedData = [];
        const q = query(teamDb, where("owner", "==", ownerID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=> {
            fetchedData[j] = doc.id;
            j++;
        });
        return fetchedData;
    }
    catch(err){
        console.log(err);
    }
}

async function fetchMatches(teamID){
    try{
        var tMData;
        const q = query(matchDb, where("teamID", "==", teamID) && where("owner", "==", loggedUser));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
           tMData = doc.data();
        });
        return tMData;
        }
    catch(err){
            console.log(err);
        }
}
async function fetchMatchID(teamID){
    try{
        var idData;
        const q = query(matchDb, where("teamID", "==", teamID) && where("owner", "==", loggedUser));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
           idData = doc.id;
        });
        return idData;
        }
    catch(err){
            console.log(err);
        }
}

// -----------------------------------------------    REQUEST AND RESPONSE MANAGEMENT   ---------------------------------------

app.post('/loginAttempt',urlencodedParser, async function(req,response){
    var username = req.body.username;
    var plainPassword = req.body.password;

    if(username && plainPassword) {
        var passVal = validatePassword(plainPassword);
        if(passVal==true){
            userData = await searchUsername(username);
            if(userData==undefined){
                response.send("User not  found");
            }
            else{
                var storedPassword = userData.password;
                var comparePasswords = await compareHash(plainPassword, storedPassword);
                if (comparePasswords == true){
                    console.log(loggedUser);
                    return response.redirect("/teams");
                }
                else {
                    response.send("Incorrect Password");
                }
            }
        }
        else{
            response.send(passVal);
        }
    }
    else{
        response.send("Please enter username and Password");
        response.end();
    }
});


app.post('/registerAttempt',urlencodedParser, async function(req,response){
    var username = req.body.username;
    var plainPassword = req.body.password;
    if(username && plainPassword) {
        var passVal = validatePassword(plainPassword)
        if(passVal==true){
            userData = await searchUsername(username);
            if(userData==undefined){
                var hashedPass = await hashPhrase(plainPassword);
                const newUserRef = doc(collection(db, "users"));

                var data = {
                    username: username,
                    password: hashedPass
                }
                await setDoc(newUserRef, data);
                return response.redirect("/teams");
            }
            else{
                response.send("User already exists");
            }
        }
        else{
            response.send(passVal);
        }
    }
    else{
        response.send("Please enter username and Password");
        response.end();
    }
});

app.post('/teams/new/addingTeam', urlencodedParser, async function(req,res){
    var teamName = req.body.teamName;
    var buzzword = req.body.teamBuzzword;
    if (teamName && buzzword) {
        var buzzVal = validateBuzzword(buzzword);
        if(buzzVal==true){
            var teamExists = await searchTeamName(teamName);
            if(teamExists.name!=teamName){
                var hashedBuzz = await hashPhrase(buzzword);
                const newTeamRef = doc(collection(db, "teams"));
                var data = {
                    buzzword: hashedBuzz,
                    owner: loggedUser,
                    name: teamName
                }

                await setDoc(newTeamRef, data);
                teamDat = await searchTeamName(teamName);
                return res.redirect("/teams");
            }
            else {
                res.send("Team Already exists");              
            }
        }
        else{
            res.send(buzzVal);
        }

    }
    
})

app.post('/request',jsonParser, async function(req,response){
    const typeOfReq = req.body.type;
    if(typeOfReq == "TeamDat"){
        var teamID = req.body.teamid;
        var teamData = await getTeamDat(teamID);
        var teamMembers = await fetchTeamMembers(teamID);
        var teamMatches = await fetchMatches(teamID);
        var teamDatObj = new team(teamData.name, teamData.buzzword, teamData.owner, teamMembers, teamMatches);
        response.send(JSON.stringify(teamDatObj));
    }
    else if(typeOfReq == "TeamNum"){
        var numOfTeams = await getTeamNum(loggedUser);
        var teamIDS = await getTeamIDs(loggedUser);
        var datObj = new reqTeamNumObj(numOfTeams,teamIDS);
        response.send(JSON.stringify(datObj));
    }
})

app.post('/teams/organise/createMatch', urlencodedParser, async function(req, res){
    const date = req.body.date;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const teamID = req.body.teamID;
    console.log(date);
    
    const newmatch = doc(collection(db, "matches"));
                var data = {
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    owner: loggedUser,
                    teamID: teamID
                }

    const currMatch = await fetchMatches(teamID);
    if (currMatch == undefined){
        console.log("Creating new Match Doc");
        newmatch = await fetchMatchID(teamID);
        const newMatchRef = doc(matchDb, currMatchID);
        await setDoc(newMatchRef, data);
        res.redirect('/response/share/'+newmatch);
        }
    else{
        console.log("Using Existing Match Doc");
        const currMatchID = await fetchMatchID(teamID);
        const currMatchRef = doc(matchDb, currMatchID);
        await updateDoc(currMatchRef, data);
        res.redirect('/response/share/'+currMatchID);
    }
})