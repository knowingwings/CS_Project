const { response } = require("express");
const bcrypt = require('bcrypt');
const express = require("express");
const path = require("path");


//firebase imports
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { utimesSync } = require("fs");
const { collection, query, where, getDocs, doc, setDoc, documentId, updateDoc, getDoc} = require("firebase/firestore");
//----------------
const bodyParser = require("body-parser");
const { urlToHttpOptions } = require("url");
const { async } = require("@firebase/util");
const { type } = require("os");
const { get } = require("http");
const { json } = require("body-parser");
const { start } = require("repl");
const { match } = require("assert");
const { Console } = require("console");

const app = express();
const saltRounds = 10;
var loggedUser; //global var of the user logged in
var openMatch; //global var of openteam
var detail;

class team { // JSON object class
    constructor(name, buzzword, owner, rifles, teamMembers, match, matchId)  {
        this.name= name,
        this.buzzword= buzzword,
        this.owner= owner,
        this.teamMembers= teamMembers,
        this.match = match,
        this.matchId = matchId,
        this.rifles = rifles
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

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
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
        const q = query(matchDb, where("teamID", "==", teamID), where("owner", "==", loggedUser));
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

async function fetchMatchByID(matchID){
    try{
        var data;
        const d = doc(matchDb, matchID);
        const docSnap = await getDoc(d);
        data = docSnap.data()
        return data;
        }
    catch(err){
            console.log(err);
        }
}

async function fetchMemberID(teamID, name){
    try{
        var idData;
        const q = query(tmembersDb, where("teamID", "==", teamID) && where("name", "==", name));
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

async function fetchTeamRifles(teamID){
    try{
        var dataRet;
        const q = doc(teamDb, teamID);
        const docSnap = await getDoc(q);
        dataRet = docSnap.data().rifles;
        return dataRet;
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
            if(userData==undefined){ // if user isn't found 
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
                //var hashedBuzz = await hashPhrase(buzzword);
                const newTeamRef = doc(collection(db, "teams"));
                var data = {
                    buzzword: buzzword,//hashedBuzz,
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
        //fetch data from page
        var teamID = req.body.teamid;
        //fetch data from firestore
        var teamData = await getTeamDat(teamID);
        var teamMembers = await fetchTeamMembers(teamID);
        var teamMatches = await fetchMatches(teamID);
        var matchID = await fetchMatchID(teamID);
        //------------------------------
        var teamDatObj = new team(teamData.name, teamData.buzzword, teamData.owner,teamData.rifles, teamMembers, teamMatches, matchID); //create object
        response.send(JSON.stringify(teamDatObj)); //send data back to client
    }
    else if(typeOfReq == "TeamNum"){
        //fetch data from firestore
        var numOfTeams = await getTeamNum(loggedUser);
        var teamIDS = await getTeamIDs(loggedUser);
        var datObj = new reqTeamNumObj(numOfTeams,teamIDS);
        response.send(JSON.stringify(datObj));
    }
    else if(typeOfReq == "matchTeamID"){
        //fetch data from page
        var matchID = req.body.id;
        //fetch data from firestore
        var matches = await fetchMatchByID(matchID);
        var datOBj = {"startTime": matches.startTime, "date": matches.date, "owner": matches.owner, "endTime": matches.endTime, "teamID": matches.teamID}; // create object
        response.send(JSON.stringify(datOBj)); //send data back to client
    }
    else if(typeOfReq == "fetchMatchID"){
        //fetch data from page
        var teamID = req.body.id;

        var matchId = await fetchMatchID(teamID);
        response.send(JSON.stringify(matchId));
    }
    else if(typeOfReq == "getDetail"){
        response.send(JSON.stringify(detail)); //send data back to client
    }
    else{ //no match return error
        response.send("ERROR");
    }
})

app.post('/teams/organise/createMatch', urlencodedParser, async function(req, res){
    //fetch data from page
    const date = req.body.date;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const teamID = req.body.teamID;
    
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
        newMatchID = await fetchMatchID(teamID); //
        const newmatch = doc(collection(db, "matches")); //creates a new reference in the matches collection
        const newMatchRef = doc(matchDb, currMatchID);
        await setDoc(newMatchRef, data);
        openMatch = '/response/reply/'+newMatchID
        res.redirect('/response/share/'+newMatchID);
        }
    else{
        console.log("Using Existing Match Doc");
        const currMatchID = await fetchMatchID(teamID);
        const currMatchRef = doc(matchDb, currMatchID);
        await updateDoc(currMatchRef, data);
        openMatch = '/response/reply/'+currMatchID;
        res.redirect('/response/share/'+currMatchID);
    }
})

app.post('/shareComplete', async function(req, res){
    res.redirect(openMatch);
})

app.post('/response/reply/send', urlencodedParser, async function(req, res){
    const leaveTime = req.body.leaveTime;
    const endTime = req.body.endTime;
    const name = req.body.members;
    const teamId = req.body.teamID;
    const dateFromPage = req.body.date;
    const buzzword = req.body.buzzword;
    const buzzCheckWord = await getTeamDat(teamId);


    if(buzzword==buzzCheckWord.buzzword){
        if(leaveTime>endTime){
            res.send("Invalid leave time")
        }
        else{
            var data = {
                endTime: leaveTime,
                date: dateFromPage
            }
            const memberId = await fetchMemberID(teamId, name);
            const memberRef = doc(tmembersDb, memberId);
            await updateDoc(memberRef, data);
            res.send("Thank You for replying")
        }
    }
    else {
        res.send("Incorrect Buzzword")
    }
    
})

app.post('/response/viewResponses/createDetail', urlencodedParser, async function(req,res){
    const numOfDetails = req.body.detailNum;
    const numOfTargets = req.body.targetNum;
    var sharedTargetBool ; //Only gets passed if checked
    const teamId = req.body.teamID;
    if (req.body.targSharing==undefined){
        sharedTargetBool = false;
    }
    else{
        sharedTargetBool = true;
    }
    var numOfLanes = 0;

    var teamMems = await fetchTeamMembers(teamId);
    const numOfPeople = teamMems.length;
    if(sharedTargetBool==true){
        numOfLanes = numOfTargets*2;
    }
    else{
        numOfLanes = numOfTargets;
    }

    for(let i=0; i<numOfPeople-1; i++){ //sort by earliest leave time bubble sort
        swapped=false;
        for(let j=0; j<numOfPeople-1; j++){
            if(teamMems[j].endTime>teamMems[j+1].endTime){
                var b = teamMems[j+1]; //swap elements pos
                teamMems[j+1] = teamMems[j];
                teamMems[j]=b; 
                swapped=true;
            }
        }
        if(swapped==false){
            break
        }
    }

    var firing = [];
    var prep = [];
    var butts = [];
    for(let q=0; q<teamMems.length; q++){ // Checks and swaps teamMembers around based on their rifle
        if(q==0 || q+1 == teamMems.length){
            teamMems[q] = teamMems[q];
        }
        else if(teamMems[q].rifle == teamMems[q+1].rifle){
            var v = teamMems[q-1];
            teamMems[q-1] = teamMems[q];
            teamMems[q] = v;
        }
    }
    for(let k=0; k<numOfLanes; k++){ //firing assignment
        if(teamMems[k]==undefined){
            break
        }
        else{
            firing[k] = teamMems[k];
        }
    }

    for(let w=0; w<numOfLanes; w++){ //prep assignment
        if(teamMems[w]==undefined){
            break
        }
        else{
            n=w+parseInt(numOfLanes);
            prep[w]=teamMems[n];
        }
    }

    for(let h=0; h<numOfLanes; h++){ //butts assignment
        if(teamMems[h]==undefined){
            break
        }
        else{
            b=h+parseInt(numOfLanes)*2;
            butts[h]=teamMems[b];
        }
    }

    detail = {"firing": firing, "prep": prep, "butts": butts, "numOfDetail":numOfDetails, "numOfLanes":numOfLanes, "numOfTargets": numOfTargets};

    res.redirect("/response/viewDetail/0");
})

app.post(`/teams/addMember`, urlencodedParser, async function(req, res){ // adding member to team
    var teamId = req.body.teamID;
    var date = req.body.date;
    var endTime = req.body.endTime;
    var name = req.body.memName;
    var rifle = req.body.rifle;
    var coach;

    if(req.body.coach == undefined){
        coach = false;
    }
    else{
        coach = true;
    }

    var data = {
        name: name,
        rifle: rifle,
        date: date,
        endTime: endTime,
        coached: coach,
        teamID: teamId
    }

    const memberRef = doc(tmembersDb);
    await setDoc(memberRef, data);
    res.redirect('/teams/edit/'+ teamId);
})

app.post('/teams/addRifleFunc', urlencodedParser, async function(req,res){
    const teamID = req.body.teamID;
    const rifleNumber = req.body.rifleNum;

    const teamRifles = await fetchTeamRifles(teamID);
    console.log(teamRifles)
    teamRifles.push(rifleNumber);

    const teamRef = doc(teamDb, teamID);
    const data = {
        rifles: teamRifles
    }
    await updateDoc(teamRef, data);
    res.redirect('/teams/edit/'+teamID);
})

app.post(`/teams/removeRifleFunc`, urlencodedParser, async function(req,res){
    const teamID = req.body.teamID;
    const rifleNumber = req.body.rifleNum;

    var teamRifles = await fetchTeamRifles(teamID);
    teamRifles = arrayRemove(teamRifles, rifleNumber);

    const teamRef = doc(teamDb, teamID);
    const data = {
        rifles: teamRifles
    }
    await updateDoc(teamRef, data);
    res.redirect('/teams/edit/'+teamID);
})

app.post(`/teams/editMemberFunc`, urlencodedParser, async function(req, res){
    const teamID = req.body.teamID;
    const memberToChange = req.body.members;
    const newName = req.body.memName;
    const rifleNum = req.body.rifle;

    const memberId = await fetchMemberID(teamID, memberToChange);
    const memberRef = doc(tmembersDb, memberId);

    if(req.body.coach == undefined){
        coach = false;
    }
    else{
        coach = true;
    }
    data = {
        name: newName,
        rifle: rifleNum,
        coached: coach
    }

    await updateDoc(memberRef, data);
    res.redirect('/teams/edit/'+teamID);
})