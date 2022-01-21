import {
  WAConnection,
  ReconnectMode,
  waChatKey,
  MessageType,
} from "@adiwajshing/baileys";
import * as fs from 'fs'



//Making Connection
const conn = new WAConnection(); // instantiate
conn.autoReconnect = ReconnectMode.onConnectionLost; // only automatically reconnect when the connection breaks
conn.connectOptions.maxRetries = 10;
fs.existsSync("./auth_info.json") && conn.loadAuthInfo("./auth_info.json");
conn.connect();
const authInfo = conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
fs.writeFileSync("./auth_info.json", JSON.stringify(authInfo, null, "\t")); // save this info to a file


var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 9000;

app.get('/home', (req,res) => {
  res.send('Hello World, This is home router');
});

app.post('/create_group', async function(req, res) {
    console.log('body is ',req.body);
    const numbers = req.body.phone_numbers.split(",");
    console.log(req.body.phone_numbers)
    // Creating the group with first conatct
    let first_num = numbers[0].toString();
    // Creating Group
    const group = await conn.groupCreate ("My Fab Group", [first_num+"@s.whatsapp.net"])
    console.log ("created group with id: " + group.gid)
    for (let i = 1; i < numbers.length; i++) {
      let num = numbers[i].toString();
      const add_people = await conn.groupAdd (group.gid, [num+"@s.whatsapp.net"])
      console.log("ok")
    }
    let response = {
      creted : "yes",
      group_id : group.gid
    }
    res.send(response);
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
