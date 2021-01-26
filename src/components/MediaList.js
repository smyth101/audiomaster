import React, {Component} from 'react';
import MediaItem from './MediaItem';

class MediaList extends Component{
    render(){
        return (
        <div className='border border-info h-100 col-3 p-0' style={{overflowX:'auto'}}>
            <h3 className='text-info mb-3 m-0 row justify-content-center'>Outputs</h3>
            {this.props.outputs.map((output) => {
            return <MediaItem device={output} mute={this.props.mute} enable={this.props.enable} key={output.id} type="outputs"/>
            })}
            <h3 className='text-info mt-5 mb-3 row-justify-content-center'>Inputs</h3>
            {this.props.inputs.map((input) => {
            return <MediaItem device={input} mute={this.props.mute} enable={this.props.enable} key={input.id} outputs={this.props.outputs} setListen={this.props.setListen} type="inputs"/>
            })}
        </div>);
    }
}

export default MediaList;