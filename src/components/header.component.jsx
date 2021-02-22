import React from 'react';

import { ReactComponent as Logo } from '../logo.svg';

import Clock from './clock.component';
import './header.styles.css';


const Header = () => (
<div className="header">
  {/* <a href="#default" class="logo">CompanyLogo</a> */}
  <Logo className="logo"/>
  <div className="header-right">
      <div className="container">
          <div id="zone">
              <span>New York</span> 
          </div>
          <div id="date">
            <Clock type={'date'}></Clock>
          </div>
      </div>
      <div id="time">
        <Clock type={'time'}></Clock>
      </div>
      <a href="#about">About</a>
      <a className="active" href="#trade">Trade</a>
      <a href="#settings">Settings</a>
  </div>
</div>
);

export default Header;