import React, {Component} from 'react';



class ProfileItem extends Component{
    constructor(props){
        super(props)
        this.state = {
            edit:false,
            name:this.props.profile.name,
            defaultInput:this.props.profile.defaultInput.id,
            defaultOutput:this.props.profile.defaultOutput.id,
            enableDevices:this.props.profile.enableDevices.map(device=>{
                return device.id
            }),
            disableDevices:this.props.profile.disableDevices.map(device=>{
                return device.id
            })
        }
    }
    handleDefaultInputSel = (e) =>{ 
        this.setState({defaultInput:parseInt(e.target.value)})
    }

    handleDefaultOutputSel = (e) =>{
        this.setState({defaultOutput:parseInt(e.target.value)})
    }

    handleProfileSelect = (e) =>{
        const isChecked = e.target.checked
        if(isChecked){
            this.props.setProfile.bind(this,this.props.profile)()
        }
    }
    handleDisDeviceSel = (e) =>{
        let newList = this.state.disableDevices;
        let newValue = parseInt(e.target.value)
        if(e.target.checked){
            newList.push(newValue)
        }
        else{
            const index = newList.indexOf(newValue);
            if (index > -1) {
                newList.splice(index, 1);
            }
        }
        this.setState({disableDevices:newList})
        
    }

    handleEnDeviceSel = (e) => {
        let newList = this.state.enableDevices;
        let newValue = parseInt(e.target.value)
        if(e.target.checked){
            newList.push(newValue)
        }
        else{
            const index = newList.indexOf(newValue);
            if (index > -1) {
                newList.splice(index, 1);
            }
        }
        this.setState({enableDevices:newList})
        
    }

    editProfile = (e) =>{
        this.setState({edit:true})
        this.props.setProfileEdit(true)
    }

    handleProfileEdit = (e) => {
        e.preventDefault()
        this.props.setProfileEdit(false)
        if(this.props.profile.id !== 1 && this.state.defaultInput === -1 && this.state.defaultOutput === -1 && this.state.disableDevices.length === 0 && this.state.enableDevices.length === 0){
            this.props.deleteProfile(this.props.profile.id)
        }
        else{
            this.props.updateProfile(this.props.profile.id,this.state.name,this.state.defaultInput,this.state.defaultOutput,this.state.enableDevices,this.state.disableDevices)
        }
        this.setState({edit:false})
    }

    cancelProfileEdit = (e) => {
        if(this.props.profile.id === -1){
            this.deleteProfile()
        }
        this.setState({edit:false,
            defaultInput:this.props.profile.defaultInput.id,
            defaultOutput:this.props.profile.defaultOutput.id,
            enableDevices:this.props.profile.enableDevices.map(device=>{
                return device.id
            }),
            disableDevices:this.props.profile.disableDevices.map(device=>{
                return device.id
            })})
        this.props.setProfileEdit(false)
    }

    deleteProfile = (e) =>{
        this.props.deleteProfile(this.props.profile.id)
    }

    async componentDidMount(){
        if(this.props.profile.id !== 1 && this.state.defaultInput === -1 && this.state.defaultOutput === -1 && this.state.disableDevices.length === 0 && this.state.enableDevices.length === 0){
            this.props.setProfileEdit(true)
            this.setState({edit:true})
        }
    }
    render(){
        if(this.state.edit){
            let deleteBtn;
            if(this.props.profile.id !== 1){
                deleteBtn = <button className='btn btn-danger float-left' onClick={this.deleteProfile}>Delete</button>
            } 
            else{
                deleteBtn = ''
            }
            return (
                <div className='mt-3'>   
                    {deleteBtn}
                    <div className='mb-1'><span className='text-info'>Profile Name: </span><input type='text' defaultValue={this.props.profile.name} onChange={e =>{this.setState({name:e.target.value})}} /></div><br/>
                    <div className ='mb-1'><span className='text-info'>Default Output: </span><OutputDefaultSelect outputs={this.props.outputs} profile={this.props.profile} handleDefaultOutputSel={this.handleDefaultOutputSel}/></div><br/>
                    <span className='text-info'>Default Input: </span><InputDefaultSelect inputs={this.props.inputs} profile={this.props.profile} handleDefaultInputSel={this.handleDefaultInputSel}/><br/>
                    <h4 className='text-info mb-1 mt-1'>Enable Devices</h4><EnableDevicesSelect inputs={this.props.inputs} outputs={this.props.outputs} enabledDevices={this.props.profile.enableDevices} disableDevices={this.state.disableDevices} handleEnDeviceSel={this.handleEnDeviceSel}/><br/>
                    <h4 className='text-info mb-1 mt-1'>Disable Devices</h4><DisableDeviceSelect inputs={this.props.inputs} outputs={this.props.outputs} disabledDevices={this.props.profile.disableDevices} enableDevices={this.state.enableDevices} handleDisDeviceSel={this.handleDisDeviceSel}/><br/>
                    <button className='btn btn-secondary m-2' onClick={this.cancelProfileEdit}>Cancel</button>
                    <button className='btn btn-primary m-2' onClick={this.handleProfileEdit} type='submit'>Save</button>
                </div>
            )
        }
        else{
            return(
                <div className='row justify-content-center border-bottom p-3'>
                    <div className='col-1'>
                        <button onClick={this.editProfile} disabled={this.props.profileEditStatus}>Edit</button>
                    </div>
                   <h3 className='text-info col-2'>{this.props.profile.name}</h3>
                   <div className='col-2'>   
                        <span className='text-info'>Output:</span> {this.props.profile.defaultOutput.name}<br/>
                    </div>
                    <div className='col-2'>
                        <span className='text-info'>Input:</span> {this.props.profile.defaultInput.name}<br/>
                    </div>
                    <div className='col-2'>
                        <span className='text-info'>Enabled Devices</span><br/>{this.props.profile.enableDevices.map(device => {
                            return <div key={device.id} className='row justify-content-center'>{device.name}</div>
                            })}
                    </div>
                    <div className='col-2'>
                        <span className='text-info'>Disabled Devices</span><br/>
                        {this.props.profile.disableDevices.map(device => {
                            return <div key={device.id} className='row justify-content-center'>{device.name}</div>
                            })}
                    </div>
                    <div className='col-1'>
                        <input type='checkbox' checked={this.props.profile.active} onClick={this.handleProfileSelect}  disabled={this.props.profileEditStatus} readOnly/><br/>
                    </div>
                </div>
            )
        }
    }

}

class InputDefaultSelect extends Component{
    
    render(){
        return (
            <select defaultValue={this.props.profile.defaultInput.id} onChange={this.props.handleDefaultInputSel.bind(this)}>
                <option value={-1} key={-1}>Unselected</option>
            {this.props.inputs.map(input => {
                let pluggedIn
                if(!input.connected){
                    pluggedIn = ' not plugged in'
                }
                else{
                    pluggedIn = ''
                }
                return <option key={input.id} value={input.id}>{input.name}{pluggedIn}</option>
            })}
        </select>    
        )
    }
}


class OutputDefaultSelect extends Component{
    render(){
        
        return (
        <select defaultValue={this.props.profile.defaultOutput.id} onChange={this.props.handleDefaultOutputSel.bind(this)}>
            <option value={-1} key={-1}>Unselected</option>
            {this.props.outputs.map(output => {
                let pluggedIn
                if(!output.connected){
                    pluggedIn = ' not plugged in'
                }
                else{
                    pluggedIn = ''
                }
                return <option value={output.id} key={output.id}>{output.name}{pluggedIn}</option>
            })}
        </select>)
    }
}


class EnableDevicesSelect extends Component{
    render(){
        const devices = this.props.outputs.concat(this.props.inputs)
        let enableIDs = this.props.enabledDevices.map(device=>{
            return device.id
        })
        return (
            <ul style={{listStyleType:'none'}}>
                {
                    devices.map(device => {
                        let pluggedIn;
                        if(!device.connected){
                            pluggedIn = 'not plugged in'
                        }
                        else{
                            pluggedIn =  ''
                        }
                        return <li key={device.id}>{device.name}{pluggedIn}<input type='checkbox' value={device.id} defaultChecked={enableIDs.includes(device.id)} onChange={this.props.handleEnDeviceSel.bind(this)} disabled={this.props.disableDevices.includes(device.id)}/></li>
                    })
                }    
            </ul>
        )
    }
}


class DisableDeviceSelect extends Component{
    render(){
        const devices = this.props.outputs.concat(this.props.inputs)
        let disableIDs = this.props.disabledDevices.map(device=>{
            return device.id
        })
        return (
            <ul style={{listStyleType:'none'}}>
                {
                    devices.map(device => {
                        return <li key={device.id}>{device.name}<input type='checkbox' value={device.id} defaultChecked={disableIDs.includes(device.id)} onChange={this.props.handleDisDeviceSel.bind(this)} disabled={this.props.enableDevices.includes(device.id)}/></li>
                    })
                }    
            </ul>
        )
    }
}

export default ProfileItem;