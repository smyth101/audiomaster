import React, {Component} from 'react';


class ActiveMediaItem extends Component{
    constructor(props){
        super(props)
        this.state={
            volume:this.props.devices.find(device=>device.default).volume,
            id:this.props.devices.find(device=>device.default).id
        };
    }

    handleVolChange = (e,id) => {
        const vol = parseInt(e.target.value);
        this.props.changeVolume(id,vol,this.props.type)
        this.setState({volume:vol})
        if(this.props.devices.mute === true){
            this.props.mute.bind(this,id)();
        }
    }

    handleDeviceChange = (e) => {
        let id = e.target.value
        let type = this.props.type
        this.props.changeDefault.bind(this,parseInt(id),type)();
    }

    
    render(){
        return(
            <div className='mb-3'>
                <select value={this.props.devices.find(device=>device.default).id} onChange={this.handleDeviceChange}>
                {
                    this.props.devices.map(device => {
                            return <option key={device.id} value={device.id}>{device.name}</option>
                    })
                }
                </select>
                <div className='ml-2 d-inline-block'>
                    <input type="range" min="0" max="100" defaultValue={this.state.volume} onChange={(e) => this.handleVolChange(e,this.state.id)}/>
                    {this.state.volume}%
                </div>
            </div>
        )
    }
}

export default ActiveMediaItem;