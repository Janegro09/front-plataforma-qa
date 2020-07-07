import React from 'react';
import './LoadingBar.css';

const Progress = ({ done }) => {
    const [style, setStyle] = React.useState({});

    setTimeout(() => {
        const newStyle = {
            opacity: 1,
            width: `${done}%`
        }

        setStyle(newStyle);
    }, 200);

    return (
        <div className="progress">
            <div className="progress-done" style={style}>
            </div>
        </div>
    )
}


const LoadingBar = () => {
    return (
        <div className="loading-bar">
            <div className="contenedor-barra">
                <h1 className="mensaje">Cargando...</h1>
                <Progress done='100' />
            </div>
        </div>
    )
};

export default LoadingBar;