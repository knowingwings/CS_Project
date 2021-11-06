const { response } = require("express");
const bcrypt = require('bcrypt');
const express = require("express");
const path = require("path");


//firebase imports
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { utimesSync } = require("fs");
const { collection, query, where, getDocs } = require("firebase/firestore");
//----------------
const bodyParser = require("body-parser");

const app = express();
const saltRounds = 10;

const firebaseConfig = {
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
const userDb = collection(db, "users")




app.use("/static", express.static(path.resolve(__dirname,"frontend", "static")));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html")); //display index.html in the frontend directory as the webpage
});

app.listen(process.env.PORT || 2040, () => console.log("Server running...")); //outputs that the server is running in terminal and runs the server through port 2040

app.post('/loginAttempt', async function(req,response){
    var username = req.body.username;
    var password = req.body.password;
    console.log("username " + username + "\npassword " + password);

    if(username && password) {
        if(username.length>20 || password.length>20){
            console.log("u or p too long");
        }
        else if (username.length<6 || password.length<8){
            console.log("u or p too short");
        }
        else{
            console.log("Checks Complete...")
            try{
            const q = query(userDb, where("username" == username));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
            }
            catch (e) {
                console.log("ERROR: ")
                throw e
            }
            
        }
    }
    else{
        response.send("Please enter username and Password");
        response.end();
    }
})

