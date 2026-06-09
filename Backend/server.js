require("dotenv").config()
const app = require('./src/app.js')
const db = require('./src/config/database.js')
const path  = require('path');
const express = require('express');




const dns = require("dns")
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]

)



db();

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/Frontend/dist")))
app.use((req, res) => {
    res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"))
})

app.listen(3000, ()=>{
    console.log("server is running port 3000");
})