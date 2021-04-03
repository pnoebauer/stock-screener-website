import React from 'react';

import { ReactComponent as Logo } from '../logo.svg';

import './header.styles.css';


const Header = () => (
    <div id="header">
        <div id="headerImage">
            <Logo className='logo'/>
        </div>

        <div class="headerText">
            <div class="tradingClock">
                <div className="clockGroup">
                    <div className="time">
                        21:05:15
                    </div>
                    <div className="date">
                        15/02/2021
                    </div>
                    <div className="timeZone">
                        New York
                    </div>
                </div>
            </div>
        </div>
        
        {/* <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </nav> */}
    </div>
);

export default Header;