import React, {Component} from 'react';



class MediaItem extends Component{
    render(){
        return(
            <div className='row justify-content-center m-0 mb-3'>
                <div className='col-8 p-0'>
                    {this.props.device.name}
                    <IsConnected connected={this.props.device.connected}/>
                </div>
                <div className='col-4 p-0'>
                    <button onClick={this.props.enable.bind(this,this.props.device.id,this.props.type,false)}><EnableButton enabled={this.props.device.active} /></button>
                </div>
                <ListenPlayback type={this.props.type} outputs={this.props.outputs} setListen={this.props.setListen} device={this.props.device}/>
            </div>
        )
    }
}

function EnableButton(props){
    if(props.enabled === true){
        return 'Disable'
    }
    else{
        return 'Enable'
    }

}


function IsConnected(props){
    if(props.connected !== true){
        return <div className='text-warning w-100'>not plugged in</div>;
    }
    else{
        return "";
    }
}

class ListenPlayback extends Component{

    PlaybackDevices = () =>{
        if(this.props.device.listen){
            return (
                <select defaultValue={this.props.device.playbackDevice} style={{fontSize:'12px'}} onChange={e => {return this.props.setListen(true,this.props.device.id,e.target.value)}}>
                    <option value={false}>Default</option>
                    {this.props.outputs.map(output => {
                        let pluggedIn
                        if(!output.connected){
                            pluggedIn = 'orange'
                        }
                        else{
                            pluggedIn = 'black'
                        }
                        return <option value={output.id} key={output.id} style={{color:pluggedIn}}>{output.name}</option>
                    })}
                </select>
            )
        }
        else{
            return ''
        }
    }

    render(){
        if(this.props.type === 'inputs'){
            let playbackDevice;
            if(this.props.device.playbackDevice !== ''){
                playbackDevice = this.props.playbackDevice
            }
            else{
                playbackDevice = false
            }
            return (
            <div className='col-12 p-0'>Listen: <input type='checkbox' checked={this.props.device.listen} onChange={this.props.setListen.bind(this,!this.props.device.listen,this.props.device.id,playbackDevice)}/> {this.PlaybackDevices()}</div>
            )
        }
        else{
            return ''
        }

    }
}
export default MediaItem;