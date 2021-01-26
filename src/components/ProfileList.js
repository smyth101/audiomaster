import React, {Component} from 'react';
import ProfileItem from './ProfileItem';

class ProfileList extends Component{
    render(){
        return <div className='col-12 pt-3'>
                <button className='btn btn-primary'onClick={this.props.newProfile.bind(this)} disabled={this.props.profileEditStatus}>New</button>
                {this.props.profiles.map(profile => {
                    return <ProfileItem profile={profile} setProfile={this.props.setProfile} updateProfile={this.props.updateProfile} deleteProfile={this.props.deleteProfile} setProfileEdit={this.props.setProfileEdit} profileEditStatus={this.props.profileEditStatus} key={profile.id} inputs={this.props.inputs} outputs={this.props.outputs} apps={this.props.apps}/>
                })}
            </div>
    }
}

export default ProfileList;