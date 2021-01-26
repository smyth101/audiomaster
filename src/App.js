// import './App.css';
import MediaList from './components/MediaList';
import ApplicationList from './components/ApplicationList';
import React, {Component} from 'react';
import ActiveMediaList from './components/ActiveMediaList';
import ProfileList from './components/ProfileList';
import axios from 'axios'
import {debounce} from 'lodash'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const idReplace = (id) =>{
  id = id.replace(/\\/g,'**bs**');
  id = id.replace(/%/g,"**perc**");
  return id;
}

class App extends Component{
  state = {
    inputs:[],
    outputs:[],
    applications:[],
    profiles:[],
    profileEditStatus:false,
    dataLoaded:false
  }

  changeProfileStatus = () =>{
    this.setState({profiles:this.state.profiles.map(profile => {
      if(profile.active){
        profile.active = false;
      }
      return profile
    })})
  }



  setEnable = (id, type, profileCall = false) => {
    if(!profileCall){
      this.changeProfileStatus()
    }
    let devices;
    if(type === "inputs"){
      devices = this.state.inputs
    }
    else if(type === "outputs"){
      devices = this.state.outputs
    }
    this.setState({type: devices.map(device => {
      if(id === device.id){
        device.active = !device.active
        axios("http://localhost:3002/enable/" + idReplace(device.itemID))
      }
      return device
    })})
  }


  changeVolume = debounce((id, vol, type) => {
    let volumeList; 
    if(type === "applications"){
      volumeList = this.state.applications
    }
    else if(type === "inputs"){
      volumeList = this.state.inputs
    }
    else if(type === "outputs"){
      volumeList = this.state.outputs
    }
    else{
      console.error("no valid media type was input")
      return
    }
    this.setState({type: volumeList.map((item) => {
      if(id === item.id){
        item.volume = vol;
        // this.changeVolCall(item,vol)
        axios("http://localhost:3002/volume/"   + idReplace(item.itemID) + "&" + vol)
      }
      return item;
    })})
  },200)


  muteItem = (id) =>{
    id = idReplace(id)
    axios("http://localhost:3002/mute/" + id)
  }

  muteApp = (id) =>{
    this.setState({applications: this.state.applications.map( app => {
      if(id === app.id){
        this.muteItem(app.name)
        app.mute = !app.mute;
      }
      return app;
    })})
  }

  activeMedia = () =>{
    let activeDevices = [];
    this.state.inputs.forEach(input => {
      if(input.default === true){
        activeDevices.push(input)
      }
    });
    this.state.outputs.forEach(input => {
      if(input.default === true){
        activeDevices.push(input)
      }
    });
    return activeDevices;
  }

  async componentDidMount() {
    axios('http://localhost:3002/devices')
      .then(response => {
        this.setState({inputs:response.data.inputs,outputs:response.data.outputs,applications:response.data.applications})
        axios('http://localhost:3002/getProfiles')
          .then(response => {
            let profiles = this.updateProfileIDs(response.data)
            this.setState({profiles:profiles,dataLoaded:true})
          })
      })
    
  }

  updateProfileIDs(profiles){
    const devices = this.state.inputs.concat(this.state.outputs)
    return profiles.map(profile => {
      if(profile.defaultInput.id !== -1){
        let inputDev = devices.find(device => device.itemID === profile.defaultInput.itemID)
        if(inputDev !== undefined){
          profile.defaultInput.id = inputDev.id
        }
        else{
          profile.defaultInput.id = -1
        }
      }
      if(profile.defaultOutput.id !== -1){
        let outputDev = devices.find(device => device.itemID === profile.defaultOutput.itemID)
        if(outputDev !== undefined){
          profile.defaultOutput.id = outputDev.id
        }
        else{
          profile.defaultOutput.id = -1
        }
      }
      if(profile.enableDevices.length > 0){
        profile.enableDevices = profile.enableDevices.filter(enableDev => {
          let enDev = devices.find(device => device.itemID === enableDev.itemID)
          if(enDev !== undefined){
            enableDev.id = enDev.id
            return enableDev
          }
        })
      }
      if(profile.disableDevices.length > 0){
        profile.disableDevices = profile.disableDevices.filter(disableDev => {
          let disDev = devices.find(device => device.itemID === disableDev.itemID)
          if(disDev !== undefined){
            disableDev.id = disDev.id
            return disableDev
          }
        })
      }
      profile.active = false
      return profile
    })
  }
  
  changeDefault = (id,type,profileCall = false) => {
    if(!profileCall){
      this.changeProfileStatus()
    }
    let devices;
    if(type === 'inputs'){
      devices = this.state.inputs
    }
    else if(type === 'outputs'){
      devices = this.state.outputs
    }
    this.setState({type:devices.map(device => {
      if(device.id === id){
        axios("http://localhost:3002/default/" + device.itemID + "&" + type)
        device.default = true
      }
      else if(device.id !== id && device.default === true){
        device.default = false
      }
      return device
    })})
  }

  setProfile = (profile) => {
    // this.changeProfileStatus()
    this.setState({profiles:this.state.profiles.map(prof => {
      if(prof.id === profile.id){
        prof.active = true
      }
      else{
        prof.active = false
      }
      return prof
    })})
    const devices = this.state.inputs.concat(this.state.outputs)
    if(profile.enableDevices.length > 0){
      profile.enableDevices.forEach(enableDevice => {
        devices.forEach(device => {
          if(device.id === enableDevice.id && !device.active){
            this.setEnable(enableDevice.id,enableDevice.type,true)
          }
        })  
      })
    }
    
    if(profile.disableDevices.length > 0){
      profile.disableDevices.forEach(disableDevice => {
        devices.forEach(device => {
          if(device.id === disableDevice.id && device.active){
            if(device.default){
              const newDevice = devices.find(dev => dev.active && dev.id !== disableDevice.id && dev.type === disableDevice.type)
              if(newDevice){
                this.changeDefault(newDevice.id,newDevice.type,true)
              }
            }
            this.setEnable(disableDevice.id,disableDevice.type,true)
          }
        })  
      })
    }
    if(profile.defaultInput.id !== -1){
      this.changeDefault(profile.defaultInput.id,'inputs',true)
    }
    if(profile.defaultOutput.id !== -1){
      this.changeDefault(profile.defaultOutput.id,'outputs',true)
    }
  }

  getMaxID = (objectList) => {
    let maxID = 0;
    objectList.forEach(object => {
      if( object.id > maxID){
        maxID = object.id
      }
    })
    return maxID
  }

  updateProfile = (profileID,name,defaultInputID,defaultOutputID,enableDevicesIDs,disableDevicesIDs) =>{
    let profID = profileID
    if(profileID === -1){
      profID = this.getMaxID(this.state.profiles) + 1
    }
    let defaultInput = this.state.inputs.find(input=>{
      return input.id === defaultInputID
    })
    if(!defaultInput){
      defaultInput = {id:-1}
    }
    let defaultOutput = this.state.outputs.find(output=>{
      return output.id === defaultOutputID
    })
    if(!defaultOutput){
      defaultOutput = {id:-1}
    }
    const inputDevices = this.state.inputs.map(input => {
      input.type = 'inputs'
      return input
    })
    const outputDevices = this.state.outputs.map(output => {
      output.type = 'outputs'
      return output
    })
    const devices = inputDevices.concat(outputDevices)
    const enableDevices = devices.filter(device=>{
      if(enableDevicesIDs.includes(device.id)){
        return {name:device.name,itemID:device.itemID,id:device.id,type:device.type}
      }
      else{
        return false
      }
    })
    const disableDevices = devices.filter(device=>{
      if(disableDevicesIDs.includes(device.id)){
        return {name:device.name,itemID:device.itemID,id:device.id,type:device.type}
      }
      else{
        return false
      }
    })
    this.setState({profiles:this.state.profiles.map(profile=>{
      if(profile.id === profileID){
        profile.name = name
        profile.id = profID
        if(defaultInput){
          profile.defaultInput = {name:defaultInput.name,itemID:defaultInput.itemID,id:defaultInput.id}
        }
        if(defaultOutput){
          profile.defaultOutput = {name:defaultOutput.name,itemID:defaultOutput.itemID,id:defaultOutput.id}
        }
        profile.enableDevices = enableDevices
        profile.disableDevices = disableDevices
      }
      return profile
    })})
    const prof = this.state.profiles.find(profile => profile.id === profID)
    if(prof.active){
      this.setProfile(prof)
    }
    let updatedProfiles = this.state.profiles
    axios.post('http://localhost:3002/profiles',updatedProfiles)
  }

  newProfile = () => {
    let profiles = this.state.profiles
    const newProfile = {name:'Untitled profile',id:-1,defaultInput:{id:-1},defaultOutput:{id:-1},enableDevices:[],disableDevices:[],active:false}
    profiles.push(newProfile)
    this.setState({profiles:profiles})
  }

  deleteProfile = (id) =>{
    this.setState({profiles:this.state.profiles.filter(profile => {
      return id !== profile.id
    }),profileEditStatus:false},() => {

      let updatedProfiles = this.state.profiles
      axios.post('http://localhost:3002/profiles',updatedProfiles)
    
    })

  }

  setProfileEdit = (status) =>{
    this.setState({profileEditStatus:status})

  }

  setListen = (state,id,device=false) => {
    const inputDevice = this.state.inputs.find(input => input.id === id)
    let outputDevice;
    let outputDeviceID
    if(device && device !== 'false'){
      outputDevice = this.state.outputs.find(output => output.id === parseInt(device))
      outputDeviceID = outputDevice.itemID
    } 
    else{
      outputDeviceID = false
    }
    axios('http://localhost:3002/listen/' + state + '&' +  inputDevice.itemID + '&' + outputDeviceID)
    this.setState({inputs:this.state.inputs.map(input => {
      if(input.id === id){
        input.listen = state
        if(!outputDevice){
          outputDevice = ''
        }
        input.playbackDevice = outputDevice.id
      }
      return input
    })})
  }

  render(){
    let activeInputs = this.state.inputs.filter(input => {
      if(input.active){
        return input
      }
      else{
        return false
      }
    });
    let activeOutputs = this.state.outputs.filter(output => {
      if(output.active){
        return output
      }
      else{
        return false
      }
    })
    if(this.state.dataLoaded){
      return (
        <div className="text-white text-center" style={{backgroundColor:`rgb(32, 35, 42)`,width:'100%',paddingLeft:'2.5%',paddingRight:'2.5%'}}>
          <div className='row align-items-center pb-3' style={{height:'6vh'}}>
            <div className='col-10 text-left'>
              <h1 className='text-info'>AudioMaster</h1>
            </div>
            <div className='justify-self-center justify-content-end'>
              <button onClick={e => {window.location.reload()}}>Refresh</button>
            </div>
          </div>
          <div className='row justify-content-center' style={{height:'64vh'}}>
            <div className='col-9 h-100'>
              <div className='row justify-content-center mh-100' style={{overflow:'auto'}}>
                <ActiveMediaList inputs={activeInputs}  outputs={activeOutputs} changeVolume={this.changeVolume} mute={this.muteInput} changeDefault={this.changeDefault}/>
                <ProfileList profiles={this.state.profiles} setProfile={this.setProfile} updateProfile={this.updateProfile} newProfile={this.newProfile} deleteProfile={this.deleteProfile} setProfileEdit={this.setProfileEdit} profileEditStatus={this.state.profileEditStatus} apps={this.state.applications} inputs={this.state.inputs} outputs={this.state.outputs}/>
              </div>
            </div>
              <MediaList inputs={this.state.inputs} outputs={this.state.outputs} mute={this.muteInput} enable={this.setEnable} setListen={this.setListen}/>
          </div>
            <ApplicationList applications={this.state.applications} inputs={this.state.inputs} outputs={this.state.outputs} changeVolume={this.changeVolume} muteApp={this.muteApp}/>
        </div>
      );
    }
    return (
    <div style={{backgroundColor:`rgb(32, 35, 42)` ,height:'100vh', width:'100vw', textAlign:'center'}}>
        <h1 className='text-info' style={{paddingTop:'20%'}}>AudioMaster</h1>
      <div className="loader"></div>
    </div>
    )
  } 
}

export default App;
