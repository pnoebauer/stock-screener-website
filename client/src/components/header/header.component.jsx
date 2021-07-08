import React from 'react';

import {NavLink} from 'react-router-dom';

import {ReactComponent as Logo} from '../../logo.svg';

import Clock from '../clock/clock.component';

import './header.styles.css';

const Header = () => (
	<div className='header'>
		{/* <a href="#default" class="logo">CompanyLogo</a> */}
		<Logo className='logo' />
		<div className='header-right'>
			<div className='container'>
				<div id='zone'>
					<span>New York</span>
				</div>
				<div id='date'>
					<Clock type={'date'}></Clock>
				</div>
			</div>
			<div id='time'>
				<Clock type={'time'}></Clock>
			</div>
			{/* <a href='#about'>About</a>
			<a className='active' href='#trade'>
				Trade
			</a>
			<a href='#settings'>Settings</a> */}
			<NavLink to='/chart' activeClassName='active'>
				Chart
			</NavLink>
			<NavLink to='/screen' activeClassName='active'>
				Radarscreen
			</NavLink>
		</div>
	</div>
);

export default Header;
