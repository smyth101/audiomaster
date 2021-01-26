const {execSync,spawnSync} = require('child_process')
const csv = require('csv-parser');
fs = require('fs');
const path = require('path')

preparePath = (path) => {
    path = path.replace('{','"{').replace('}','}"')
    path += '\\Properties'
    return path
}

getListenState = (path) => {
    const command = 'cd Registry::' + path + ' ; (Get-ItemProperty .)."{24dbb0fc-9311-4b3d-9cf0-18ff155639d4},1"'
    const ps = spawnSync('powershell.exe',[command]);
    let byteArray = []
    let dataString = ps.stdout.toString()
    let dataList = dataString.split('\r\n')
    dataList.forEach(value => {
        if(value != ''){
            byteArray.push(parseInt(value))
        }
    })
    if(byteArray[8] === 255 && byteArray[9] === 255){
        return true
    }
    else{
        return false
    }

}

getCustomListenDevice = (path) =>{
    const command = 'cd Registry::' + path + ' ; (Get-ItemProperty .)."{24dbb0fc-9311-4b3d-9cf0-18ff155639d4},0"'
    const ps = spawnSync('powershell.exe',[command]);
    const customDevice = ps.stdout.toString().trim()
    return customDevice  
}

muteBool = (mute) => {
    return mute != "No"
}

isActive = state => {
    return state == "Active"
}

isConnected = state => {
    return state != "Unplugged"
}

isDefault = defaultStatus => {
    return defaultStatus == "Render" || defaultStatus =="Capture"
}

getAppType = direction => {
    if(direction == "Capture"){
        return "inputs"
    }
    else if(direction == "Render"){
        return "outputs"
    }
}

setListenDevIDs = (inputs,outputs) => {
    inputs.map(input => {
        for(let i=0;i < outputs.length;i++){
            if(outputs[i].itemID === input.playbackDevice){
                input.playbackDevice = outputs[i].id
                break
            }
        }
        return input
    })
    return inputs
}

exports.getDevicesAndApps = async() =>{
    const command = 'cd ' + __dirname + ' && SoundVolumeView.exe /scomma device_list.csv';
    execSync(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        return stdout;
    });
    let devicesAndApps = {};
    let inputs = [];
    let outputs = [];
    let applications = [];
    let deviceID = 0;
    let appID = 0;
    let proms = new Promise(function(resolve,reject){
        console.log(path.join(__dirname,'device_list.csv'))
        fs.createReadStream(path.join(__dirname,'device_list.csv'),'latin1')
            .pipe(csv())
            .on('data', (data) => {
                
                if(data.Type == 'Device'){
                    if(data.Direction == 'Capture'){
                        let input = {
                            "name": data.Name + '(' + data['Device Name'] + ')',
                            "volume": parseInt(data["Volume Percent"]),
                            "mute": muteBool(data.Muted),
                            "itemID": data["Item ID"],
                            "id": deviceID,
                            "active": isActive(data["Device State"]),
                            "default": isDefault(data.Default),
                            "listen":getListenState(preparePath(data['Registry Key'])),
                            "playbackDevice":getCustomListenDevice(preparePath(data['Registry Key'])),
                            "connected": isConnected(data["Device State"]),
                            "type":"inputs"
                        }
                        inputs.push(input)
                        deviceID+=1
                    }
                    else if(data.Direction == "Render"){
                        let output = {
                            "name": data.Name + '(' + data['Device Name'] + ')',
                            "volume": parseInt(data["Volume Percent"]),
                            "mute": muteBool(data.Muted),
                            "itemID": data["Item ID"],
                            "id": deviceID,
                            "active": isActive(data["Device State"]),
                            "default": isDefault(data.Default),
                            "connected": isConnected(data["Device State"]),
                            "type":"outputs"
                        }
                        outputs.push(output)
                        deviceID+=1
                    }
                }
                else if(data.Type == 'Application' && data.Name != 'System Sounds'){
                    let mute = muteBool(data.Muted);
                    let app = {
                        "name" : data.Name,
                        "type" : getAppType(data.Direction),
                        "volume" : parseInt(data["Volume Percent"]),
                        "mute" :  mute,
                        "device" : data["Device Name"],
                        "itemID" : data["Item ID"],
                        "id" : appID
    
                    }
                    applications.push(app);
                    appID += 1;
                }
            })
            .on('end', () => {
                inputs = setListenDevIDs(inputs,outputs)
                devicesAndApps = {
                    inputs,
                    outputs,
                    applications
                }
                resolve(devicesAndApps)
            }); 
    })
    let devicesObject = await proms;
    return devicesObject;
}