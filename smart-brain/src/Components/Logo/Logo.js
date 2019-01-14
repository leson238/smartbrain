import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png'

const Logo = () => {
    return (
        <div className = 'ma4 mt0'>
            <Tilt className="Tilt" options={{ max : 60 }} style={{ height: 100, width: 100 }} >
                <div className="Tilt-inner"> 
                        <img style = {{paddingTop : '5px'}} alt = 'logo' src = {brain} /> 
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;