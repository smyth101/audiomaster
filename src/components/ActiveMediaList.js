import React, {Component} from 'react';
import ActiveMediaItem from './ActiveMediaItem.js';

class ActiveMediaList extends Component{
    render(){
        return(
        <div className='border border-info w-100'>
            
            <span className='text-info font-weight-bold'>Default</span>
            <ActiveMediaItem devices={this.props.outputs} changeVolume={this.props.changeVolume} mute={this.props.mute} changeDefault={this.props.changeDefault} type='outputs'/>
            <ActiveMediaItem className='d-inline-block' devices={this.props.inputs} changeVolume={this.props.changeVolume} mute={this.props.mute} changeDefault={this.props.changeDefault} type='inputs'/>
        </div>)
    }
}

export default ActiveMediaList;