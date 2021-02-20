import React from 'react';

import { ReactComponent as Logo } from '../logo.svg';

import './header.styles.css';


const Header = () => (
<div className="header">
  {/* <a href="#default" class="logo">CompanyLogo</a> */}
  <Logo className="logo"/>
  <div className="header-right">
      <div className="zone-date">
          <div className="date">
              15/02/2021
          </div>
          <div className="zone">
              New York
          </div>
      </div>
      <div className="time">21:05:12</div>
      <a href="#about">About</a>
      <a className="active" href="#trade">Trade</a>
      <a href="#settings">Settings</a>
  </div>
</div>
);

export default Header;