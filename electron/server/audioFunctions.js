const {execSync} = require('child_process');
const path = require('path')
const csv = require('csv-parser');
fs = require('fs');

exports.muteSwitch = (itemID) =>{
    const command = path.join(__dirname,'SoundVolumeView.exe') + ' /Switch "' + itemID + '"';
    execSync(command);
}


exports.setVolume = (itemID,vol) =>{
    const command = path.join(__dirname,'SoundVolumeView.exe') + ' /SetVolume "' + itemID + '" ' + vol
    execSync(command);
}

exports.enableSwitch = (id) => {
    const command = path.join(__dirname,'SoundVolumeView.exe') + ' /DisableEnable "' + id + '"';
    execSync(command);
}

exports.setDefault = (id,type) => {
    command  = path.join(__dirname,'SoundVolumeView.exe') + ' /SetDefault "' + id + '" 0'
    execSync(command)
}

exports.getProfiles = () =>{
        const profiles = JSON.parse(fs.readFileSync(path.join(__dirname,'profiles.json')))
        return profiles
}

exports.setListen = (id,state) => {
    if(state){
        state = 1
    }
    else{
        state = 0
    }
    command = path.join(__dirname,'SoundVolumeView.exe') + ' /SetListenToThisDevice "' + id + '" ' + state
    execSync(command)
}

exports.setListenDevice = (id, device) => {
    command = path.join(__dirname,'SoundVolumeView.exe') + ' /SetPlaybackThroughDevice "' + id + '" "' + device + '"'
    execSync(command)
}