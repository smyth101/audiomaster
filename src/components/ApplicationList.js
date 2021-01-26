import React, {Component} from 'react';
import AppItem from './AppItem';

class ApplicationList extends Component{
    render(){
        return <div className='border border-info row flex-nowrap' style={{height:'30vh',overflowX:'auto'}}>
            {this.props.applications.map(app => {
                let deviceList;
                if(app.type === "inputs"){
                    deviceList = this.props.inputs;
                }
                else if(app.type === "outputs"){
                    deviceList = this.props.outputs;
                }
                else{
                    console.error("incorrect type for application");
                }
                let appDevice;
                deviceList.forEach(device => {
                    if(device.itemID === app.itemID.split('|')[0]){
                        appDevice = device
                        return
                    }
                })
                return <AppItem app={app} device={appDevice} changeVolume={this.props.changeVolume} muteApp={this.props.muteApp} key={app.id}/>
            })}
        </div>
    }
}

export default ApplicationList;