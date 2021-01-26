import React, {Component} from 'react';
class AppItem extends Component{

    constructor(props){
        super(props)
        this.state = {
            volume : this.props.app.volume
        }
    }
    
    handleVolChange = (e) => {
        const vol = parseInt(e.target.value);
        this.props.changeVolume.bind(this,this.props.app.id,vol,"applications")();
        if(this.props.app.mute === true){
            this.props.muteApp.bind(this,this.props.app.id)();
        }
        this.setState({volume:vol})
    }

    render(){
        return(
            <div className='col-2 pt-3 h-100'>
                <h5 className='text-info m-0' style={{height:'20%',fontSize:'1.2vw'}}>
                    {this.props.app.name} 
                </h5>
                <div style={{height:'80%'}}>
                    <img src={'http://localhost:3002/icons/' + this.props.app.name.replace(/[^\w]/gi, '_').toLowerCase() + '.png'} style={{width:'45%',padding:'5%'}} alt={this.props.app.name + ' logo'} onError={ e => {e.target.src='./react-logo.png'}}/><br/>
                    <input type='range' min='0' max='100' defaultValue={this.props.app.volume} onChange={this.handleVolChange}/>
                    <b>{this.state.volume}%</b>
                    <button onClick={this.props.muteApp.bind(this,this.props.app.id)}>
                        <MuteButton mute={this.props.app.mute}/>
                    </button><br/>
                    {this.props.device.name}
                    </div>
            </div>
        )
    }

}

function MuteButton(props){
    if(props.mute){
        return 'Unmute'
    }
    else{
        return 'Mute'
    }

}



export default AppItem;