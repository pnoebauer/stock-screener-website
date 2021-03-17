import React from 'react';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';

import { INTERVALS, SYMBOLS } from '../../assets/constants';

import './radarscreen.styles.css';

// const headerTitle = ['Symbol', 'Interval', 'Price']


class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// header: headerTitle,
			Symbol: SYMBOLS.slice(0,8),
			Interval: Array(8).fill(INTERVALS[0]),
			Price: Array(8).fill(0)
		}

		this.state.header = Object.keys(this.state);

		// console.log(this.state)
		this.setHeaderTitle();
	}

	setHeaderTitle = () => {
		const { header, ...rest } = this.state;
		
		const headerTitle = Object.keys(rest);
		// console.log(headerTitle);
	}

	componentDidMount() {
		const { Symbol } = this.state;
		// console.log('mount')
		this.props.fetchRealTimeData(Symbol, 'lastPrice')
		.then(data => this.setState({
					Price: data
				})	
		);
	}

	onChange = (updatedValue, headerCol, valueRow) => {

		const {fetchRealTimeData} = this.props;
		this.setState(prevState => {
			const columnName = prevState.header[headerCol];	//which column changed (Symbol, Interval)
			return {
				[columnName]: Object.assign([], prevState[columnName], {[valueRow]: updatedValue})
			}
		}
		,
		() => {
		fetchRealTimeData(new Array(this.state.Symbol[valueRow]), 'lastPrice')
		.then(lastPrice => {
			this.setState(prevState => ({
				Price: Object.assign([], prevState.Price, {[valueRow]: lastPrice[0]})
			})
		)});
		}
		)
	}

	sortTable = (event) => {
		const sortedTable = this.props.onSort(event, this.state);
		this.setState(sortedTable);
	}

	getClassNameForHeader = name => {
		const { sortConfig } = this.props;
		if (!sortConfig) {
			return;
		}
		const direction = sortConfig.direction === 1 ? 'ascending' : 'descending'; 
		return sortConfig.sortedField === name ? direction : undefined;
	};

	handleColumnUpdate = names => {
		console.log(names);

		const stateClone = JSON.parse(JSON.stringify(this.state));
		const headerList = stateClone.header;
		delete stateClone.header;

		headerList.forEach(header => {
			if(names.includes(header)) {
				console.log(header, 'included')
			}
			else {
				console.log(header, 'not included')
			}

		})

		names.forEach((value,index) => {
			// console.log(value in stateClone, value, 'exists')
			// console.log(!(value in stateClone), value, 'does not exist')

			if(stateClone.hasOwnProperty(value)) {
				console.log(value, 'hasOwnProperty exists');
			}
			if(!stateClone.hasOwnProperty(value)) {
				console.log(value, 'hasOwnProperty does not exist');
			}
		})

	}
	
	render() {
		const { header, Symbol } = this.state;
		const { sortConfig } = this.props;
		// console.log('rend',this.state,this.props)

		return (
			<div className="radarscreen">
				<div id="grid-container" 
					style={{gridTemplateColumns: `repeat(${header.length}, 1fr) 0`}}
				>
					<ScreenHeader 
						header={header}
						sortTable={this.sortTable}
						sortConfig={sortConfig}
					/>
					<AddColumnButton 
						style={{
                            gridColumn: `${header.length}+1`
                        }}
						handleColumnUpdate={this.handleColumnUpdate}
					/>
					<GenerateGrid 
						{...this.state}
						onChange={this.onChange}
					/>
				</div>
		</div>
		)
	}
}

export default RadarScreen;