# Audio Master
 
 audio master is a windows application that allows you to control all of your audio from one simple and easy to use program. AudioMaster allows users to:

## Features
* Change output device audio levels
* Change input device(microphone) audio levels
* Enable Listen to on input devices(useful for hearing microphone levels or passing audio through from an external source like a PS4)
* Select playback device for listen to input
* Create profiles to jump between different audio setups you may have

The application uses [SoundVolumeView](https://www.nirsoft.net/utils/sound_volume_view.html) by Nirsoft for the majority of the communication between the React front end and the windows operating system. This executable is required if you wish to clone this repository and the contents of the SoundVolumeView zip file needs to be extracted into the electron/server/ directory of the AudioMaster repo.

The current version of audioMaster does not support live refresh so any changes to audio devices/applications outside of ones changed with the audioMaster application itself will not automatically appear and manual refresh is required. Icons for programs are also currently pulled from the icons folder within the electron/server/icons directory so if you wish to have an icon that is not currently added, add a png with the name of the application into this folder.

## Install

Ensure node is installed, to check if node is installed on your machine simply run
```bash
node -v
```

this project was build on version 12.16.1

next, clone this repository into a directory of your choice and then cd into the audiomaster directory

```bash
git clone https://github.com/smyth101/audiomaster
cd audiomaster
```
from the audiomaster root directory, install all of the repos dependencies
```bash
npm install
```

Once you have cloned the repository and installed its dependencies go to  [nirsoft.net/utils/sound_volume_view.html](https://www.nirsoft.net/utils/sound_volume_view.html), download the zip file and extract the contents into the electron/server/ directory of the audioMaster repo you just cloned.
