require("dotenv").config()
const app = require('./src/app.js')
const db = require('./src/config/database.js')

const dns = require("dns")
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]

)

db();

app.listen(3000, ()=>{
    console.log("server is running port 3000");
})