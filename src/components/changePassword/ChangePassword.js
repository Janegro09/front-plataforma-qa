import React, { Component } from 'react'
// import swal from 'sweetalert';

export default class ChangePassword extends Component {
    render() {
        return (
            <div>
                {/* <div>
                    {swal("Hello world!")}
                </div> */}
                <button
                    onClick={() => console.log('clicked')}
                >Cambiar contraseña</button>
            </div>
        )
    }
}
