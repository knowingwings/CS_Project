const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname,"frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html")); //display inex.html in the frontend directory as the webpage
});

app.listen(process.env.PORT || 2040, () => console.log("Server running...")); //outputs that the server is running in terminal and runs the server through port 2040