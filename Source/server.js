const { response } = require("express");
const bcrypt = require('bcrypt');
const express = require("express");
const path = require("path");
//const firebase = require('firebase');
//require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");





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


app.use("/static", express.static(path.resolve(__dirname,"frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html")); //display index.html in the frontend directory as the webpage
});

app.listen(process.env.PORT || 2040, () => console.log("Server running...")); //outputs that the server is running in terminal and runs the server through port 2040

app.post('/auth', (req,response) => {
    var username = document.getElementById("username");
    var password = document.getElementById("password");

    if(username && password) {
        if(username.length()>20 || password.length()>20){
            response.send("Your Username or Password is too short")
        }
    }
    else{
        response.send("Please enter username and Password");
        response.end();
    }
})

