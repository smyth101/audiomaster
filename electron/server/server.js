const Express = require("express");
const func = require('./audioFunctions')
const app = Express();
const port = 3002;
const cors = require('cors')
const fs = require('fs')
const devProps = require('./deviceProperties')
const path = require('path')
const {execSync} = require('child_process');    

app.use(cors())
app.use(Express.json())

app.use('/icons',Express.static(path.join(__dirname,'icons')))
function idRestore(id){
    id = id.replace(/\*\*bs\*\*/g,'\\');
    id = id.replace(/\*\*perc\*\*/g,'%');
    return id
}

app.get("/mute/:itemID", (req,res) => {
    // func.getDevicesAndApps()
    let itemID = req.params.itemID;
    itemID = itemID.replace(/\*\*bs\*\*/g,'\\');
    itemID = itemID.replace(/\*\*perc\*\*/g,'%');
    func.muteSwitch(itemID);
    res.send("DONE");
})


app.get("/devices", async (req,res) => {
    const devicesAndApps = await devProps.getDevicesAndApps()
    res.json(devicesAndApps);

})

app.get("/volume/:itemID&:volume", (req,res) => {
    func.setVolume(idRestore(req.params.itemID),req.params.volume)
    res.send('200')
})

app.get("/enable/:id",(req,res) => {
    func.enableSwitch(idRestore(req.params.id))
    res.send('200')
})

app.get("/default/:id&:type", (req,res) => {
    func.setDefault(req.params.id,req.params.type)
    res.send('200')
})

app.post("/profiles", (req,res)=>{
    const jsonString = JSON.stringify(req.body)
    fs.writeFileSync(path.join(__dirname,'profiles.json'), jsonString);
    res.send('200')
})

app.get("/getProfiles", (req,res)=> {
    const profiles = func.getProfiles()
    res.json(profiles)
})


app.get("/listen/:state&:id&:device", (req,res) => {
    func.setListen(req.params.id,eval(req.params.state))
    if(req.params.device){
        func.setListenDevice(req.params.id,req.params.device)
    }
    res.send('200')
})

app.get('/test',(req,res)=>{
    // const profiles = JSON.parse(fs.readFileSync(path.join(__dirname,'profiles.json')))
    // res.json(profiles)
    const command = path.join(__dirname, 'SoundVolumeView.exe') + ' /Switch "Chrome.exe"';
    execSync(command);
    res.send('IT WORKED')
})
app.listen(port,() => console.log("listening on port " + port))
