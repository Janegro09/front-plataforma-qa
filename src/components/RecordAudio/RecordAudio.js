import React, { Component } from 'react'
import MicRecorder from 'mic-recorder-to-mp3';

import Global from '../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import './RecordAudio.css';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class RecordAudio extends Component {
    state = {
        isRecording: false,
        blobURL: '',
        isBlocked: false,
        dataSend: null,
        stopRec: false
    }

    componentDidMount() {
        navigator.getUserMedia({ audio: true },
            () => {
                this.setState({ isBlocked: false });
            },
            () => {
                this.setState({ isBlocked: true })
            },
        );
    }

    start = () => {
        if (this.state.isBlocked) {
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    this.setState({ isRecording: true });
                }).catch((e) => console.error(e));
        }
    };

    send = (file) => {
        let formData = new FormData();
        formData.append('file', file)

        let { id, idStep, idUsuario } = this.props.ids;

        // /analytics/partitures/:id/:userId/:stepId/files?section=monitorings
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.post(Global.getAllPartitures + '/' + id + '/' + idUsuario + '/' + idStep + '/files?section=coachings', formData, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            window.location.reload(window.location.href);
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    // swal("Error!", "Hubo un problema al agregar el arhcivo", "error");
                    swal("Error!", `${e.response.data.Message}`, "error");
                    this.setState({
                        loading: false
                    })
                }
                console.log("Error: ", e)
            });
    }

    stop = () => {
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                const dataSend = new Blob([blob], {
                    type: 'audio/mp3'

                });
                this.setState({ dataSend, blobURL, isRecording: false, stopRec: true });
            }).catch((e) => console.log(e));
    };

    render() {
        const { dataSend, isRecording, stopRec } = this.state;
        return (
            <div className="recordSection">
                <audio src={this.state.blobURL} controls="controls" type="audio/mp3" id="audio" />
                <div className='mainButtons'>
                    {!isRecording &&
                        <button className="controlButtons green" onClick={this.start} disabled={this.state.isRecording}>
                            Grabar
                        </button>
                    }

                    {isRecording &&
                        <button className="controlButtons red" onClick={this.stop} disabled={!this.state.isRecording}>
                            Parar
                         </button>
                    }
                </div>

                {stopRec && !isRecording &&
                    <button className="controlButtons" onClick={(e) => {
                        e.preventDefault();
                        this.props.onSend();
                        this.send(dataSend);
                    }} disabled={!dataSend}>
                        Enviar
                    </button>
                }
                

            </div>
        )
    }
}
