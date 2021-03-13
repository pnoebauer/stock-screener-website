import React from 'react';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';

import { INTERVALS, SYMBOLS } from '../../assets/constants';

import './radarscreen.styles.css';

const headerTitle = ['Symbol', 'Interval', 'Price']


class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			header: headerTitle,
			Symbol: SYMBOLS.slice(0,8),
			Interval: Array(8).fill(INTERVALS[0]),
			Price: Array(8).fill(0)
		}
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
	
	render() {
		const { header, Symbol } = this.state;
		const { sortConfig } = this.props;
		// console.log('rend',this.state,this.props)

		return (
			<div className="radarscreen">
				<div id="grid-container">
					<ScreenHeader 
						header={header}
						sortTable={this.sortTable}
						sortConfig={sortConfig}
					/>
					<AddColumnButton />
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