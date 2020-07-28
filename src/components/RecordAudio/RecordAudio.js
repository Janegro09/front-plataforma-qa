import React, { Component } from 'react'
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class RecordAudio extends Component {
    state = {
        isRecording: false,
        blobURL: '',
        isBlocked: false,
    }

    componentDidMount() {
        navigator.getUserMedia({ audio: true },
            () => {
                console.log('Permission Granted');
                this.setState({ isBlocked: false });
            },
            () => {
                console.log('Permission Denied');
                this.setState({ isBlocked: true })
            },
        );
    }

    start = () => {
        if (this.state.isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    this.setState({ isRecording: true });
                }).catch((e) => console.error(e));
        }
    };

    stop = () => {
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                this.setState({ blobURL, isRecording: false });
            }).catch((e) => console.log(e));
    };

    render() {
        let { blobURL } = this.state;

        console.log(blobURL)
        return (
            <>
                <button onClick={this.start} disabled={this.state.isRecording}>
                    Grabar
                </button>
                <button onClick={this.stop} disabled={!this.state.isRecording}>
                    Parar
                </button>
                <audio src={this.state.blobURL} controls="controls" type="audio/mp3" />
            </>
        )
    }
}
