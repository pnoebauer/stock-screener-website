import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';

import {ChartCanvas, Chart} from 'react-stockcharts';

import './chart.styles.css';

import {
	BarSeries,
	AreaSeries,
	CandlestickSeries,
	LineSeries,
	MACDSeries,
} from 'react-stockcharts/lib/series';
import {XAxis, YAxis} from 'react-stockcharts/lib/axes';
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';

import {discontinuousTimeScaleProviderBuilder} from 'react-stockcharts/lib/scale';
import {
	OHLCTooltip,
	MovingAverageTooltip,
	MACDTooltip,
} from 'react-stockcharts/lib/tooltip';
import {ema, sma, macd} from 'react-stockcharts/lib/indicator';
import {fitWidth} from 'react-stockcharts/lib/helper';

import Modal from '../portal-modal/modal.component';
import ChartIndicatorConfigurationForm from '../chart-indicator-config/chart-indicator-config.component';

import {getChartIndicatorConfigs} from '../../redux/chart/chart.selectors';

function getMaxUndefined(calculators) {
	return calculators.map(each => each.undefinedLength()).reduce((a, b) => Math.max(a, b));
}

const pipe =
	(...fns) =>
	x =>
		fns.reduce((v, f) => f(v), x);

const LENGTH_TO_SHOW = 180;

const macdAppearance = {
	stroke: {
		macd: '#FF0000',
		signal: '#00F300',
	},
	fill: {
		divergence: '#4682B4',
	},
};

const indicatorFunctions = {
	ema,
	sma,
	macd,
};

class CandleStickChartPanToLoadMore extends React.Component {
	constructor(props) {
		super(props);
		const {data: inputData} = props;

		console.log({inputData: inputData.length});

		const {indicatorConfigurations} = props;
		console.log({indicatorConfigurations});

		const indicators = indicatorConfigurations.map(indicator => {
			return (
				indicatorFunctions[indicator.type]()
					.id(indicator.id)
					.options({windowSize: indicator.windowSize})
					.merge((d, c) => {
						// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');

						// d[`${indicator.type}-${indicator.id}-${indicator.windowSize}`] = c;
						d[`indicator-${indicator.id}`] = c;
					})
					// .accessor(d => d[`${indicator.type}-${indicator.id}-${indicator.windowSize}`]);
					.accessor(d => d[`indicator-${indicator.id}`])
			);
		});

		const maxUnstablePeriod = getMaxUndefined(indicators);
		// console.log({maxUnstablePeriod});

		const startPoint = -LENGTH_TO_SHOW - maxUnstablePeriod;

		/* SERVER - START */
		// retrieves the last X candles from the data series
		const dataToCalculate = inputData.slice(startPoint);
		console.log({startPoint});

		// add the indicator values to each candle
		const calculatedData = pipe(...indicators)(dataToCalculate);

		console.log({calculatedData});

		const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

		// /Users/Phil/Desktop/Web Dev/Projects/stock-screener/client/node_modules/react-stockcharts/lib/scale//level.js
		// adds index to series and level (level depends on the date, i.e. odd days = 11, even days = 12, start of week = 13, start of month = 14)
		const {index} = indexCalculator(calculatedData);
		console.log({index});

		/* SERVER - END */

		// add index to the data series
		const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);
		// console.log({xScaleProvider: xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW))});
		const {
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

		// console.log({xScale});
		// console.log(linearData.length)

		// linear data is same as calculatedData, with the exception that the idx property was added (idx: {index, level, date, format()}) --> done under xScaleProvider
		// console.log({linearData});

		this.state = {
			indicators,
			// linearData, //-->appears not to be needed
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
			visible: false,
			inactive: false,
			startPoint,
		};

		console.log('s', this.state);
	}

	handleDownloadMore = (start, end) => {
		console.log(start, end, 'start, end');
		if (Math.ceil(start) === end) return;
		// console.log("rows to download", rowsToDownload, start, end)

		// const {data: prevData, ema26, ema12, macdCalculator, smaVolume50} = this.state;
		const {data: prevData, indicators} = this.state;
		const {data: inputData} = this.props;

		console.log({inputData: inputData.length, prevData: prevData.length}, 'update');

		if (inputData.length === prevData.length) return;

		const rowsToDownload = end - Math.ceil(start);

		const maxUnstablePeriod = getMaxUndefined(indicators);

		const startPoint = -rowsToDownload - maxUnstablePeriod - prevData.length;
		const endPoint = -prevData.length;

		/* SERVER - START */

		// same as before --> inputData.slice(-rowsToDownload - maxUnstablePeriod); --> except that window has been moved rowsToDownload to the left
		// in short: new window is rowsToDownload(=>how far the cursor moved chart to the left) plus the unstablePeriod moved to the left of the prior window
		const dataToCalculate = inputData.slice(startPoint, endPoint);

		console.log(
			'slice',
			{startPoint},
			{endPoint},
			{rowsToDownload, maxUnstablePeriod, length: prevData.length}
		);

		// add the indicator values to each candle
		const calculatedData = pipe(...indicators)(dataToCalculate);

		console.log({calculatedData}, 'update');

		// BEFORE:
		// const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

		const indexCalculator = discontinuousTimeScaleProviderBuilder()
			.initialIndex(Math.ceil(start))
			.indexCalculator();

		// adds index to series and level (level depends on the date, i.e. odd days = 11, even days = 12, start of week = 13, start of month = 14)
		const {index} = indexCalculator(
			calculatedData.slice(-rowsToDownload).concat(prevData)
		);

		console.log({index}, 'update');

		/* SERVER - END */

		// BEFORE:
		// const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);

		// add index to the data series
		const xScaleProvider = discontinuousTimeScaleProviderBuilder()
			.initialIndex(Math.ceil(start))
			.withIndex(index);

		console.log(
			{
				xScaleProvider: xScaleProvider(
					calculatedData.slice(-rowsToDownload).concat(prevData)
				),
			},
			'update'
		);

		const {
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData.slice(-rowsToDownload).concat(prevData));

		// console.log({linearData}, 'update');

		// console.log(linearData.length)
		setTimeout(() => {
			// simulate a lag for ajax
			this.setState({
				data: linearData,
				xScale,
				xAccessor,
				displayXAccessor,
				startPoint,
			});
		}, 300);
	};

	show = id => {
		// console.log('show', id);
		// this.setState({visible: true, inactive: false});
		this.setState({visible: id, inactive: false});
	};

	hide = () => {
		this.setState({visible: false, inactive: false});
	};

	//  required to achieve the fade out effect
	closeForm = () => this.setState({inactive: true});

	// componentDidUpdate(prevProps) {
	// 	const {data: inputData, indicatorConfigurations} = this.props;

	// 	if (prevProps.indicatorConfigurations !== indicatorConfigurations) {
	// 		// console.log('changed', indicatorConfigurations);

	// 		let updatedIndicator, updatedId;

	// 		for (let i = 0; i < indicatorConfigurations.length; i++) {
	// 			if (prevProps.indicatorConfigurations[i] !== indicatorConfigurations[i]) {
	// 				console.log({i}, indicatorConfigurations[i]);

	// 				// check if state manipulation is fine
	// 				// check if id is always in the correct location in the array
	// 				updatedIndicator = this.state.indicators[i].options({
	// 					windowSize: indicatorConfigurations[i].windowSize,
	// 					sourcePath: indicatorConfigurations[i].sourcePath,
	// 				});

	// 				updatedId = i;
	// 			}
	// 		}

	// 		const maxUnstablePeriod = getMaxUndefined([updatedIndicator]);
	// 		// console.log('MAX-----', maxUnstablePeriod);
	// 		/* SERVER - START */
	// 		const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxUnstablePeriod);

	// 		// const calculatedData = ema26(dataToCalculate);
	// 		const calculatedData = updatedIndicator(dataToCalculate);
	// 		// console.log('calculatedData-----', calculatedData);
	// 		const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

	// 		// console.log(inputData.length, dataToCalculate.length, maxUnstablePeriod)
	// 		const {index} = indexCalculator(calculatedData);
	// 		/* SERVER - END */

	// 		const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);
	// 		const {
	// 			data: linearData,
	// 			xScale,
	// 			xAccessor,
	// 			displayXAccessor,
	// 		} = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

	// 		this.setState(
	// 			prevState => ({
	// 				indicators: prevState.indicators.map((indicator, index) => {
	// 					if (index === updatedId) {
	// 						return updatedIndicator;
	// 					}
	// 					return indicator;
	// 				}),
	// 				data: linearData,
	// 				xScale,
	// 				xAccessor,
	// 				displayXAccessor,
	// 			}),
	// 			() => console.log({updatedState: this.state})
	// 		);
	// 	}
	// }

	componentDidUpdate(prevProps) {
		const {indicatorConfigurations, data: inputData} = this.props;

		if (prevProps.indicatorConfigurations !== indicatorConfigurations) {
			// console.log('changed', indicatorConfigurations);

			let updatedIndicator, updatedId;

			// 		for (let i = 0; i < indicatorConfigurations.length; i++) {
			// 			if (prevProps.indicatorConfigurations[i] !== indicatorConfigurations[i]) {
			// 				console.log({i}, indicatorConfigurations[i]);

			// 				// check if state manipulation is fine
			// 				// check if id is always in the correct location in the array
			// 				updatedIndicator = this.state.indicators[i].options({
			// 					windowSize: indicatorConfigurations[i].windowSize,
			// 					sourcePath: indicatorConfigurations[i].sourcePath,
			// 				});

			// 				updatedId = i;
			// 			}
			// 		}

			// const indicators = indicatorConfigurations.map((indicator, index) => {
			// 	if (prevProps.indicatorConfigurations[index] !== indicator) {
			// 		console.log({index});
			// 	}
			// 	return (
			// 		indicatorFunctions[indicator.type]()
			// 			.id(indicator.id)
			// 			.options({windowSize: indicator.windowSize})
			// 			.merge((d, c) => {
			// 				// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');

			// 				// d[`${indicator.type}-${indicator.id}-${indicator.windowSize}`] = c;
			// 				d[`indicator-${indicator.id}`] = c;
			// 			})
			// 			// .accessor(d => d[`${indicator.type}-${indicator.id}-${indicator.windowSize}`]);
			// 			.accessor(d => d[`indicator-${indicator.id}`])
			// 	);
			// });

			const indicators = indicatorConfigurations.map((indicator, index) => {
				if (prevProps.indicatorConfigurations[index] !== indicator) {
					// console.log({index});

					return (
						indicatorFunctions[indicator.type]()
							.id(indicator.id)
							.options({windowSize: indicator.windowSize})
							.merge((d, c) => {
								// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');

								// d[`${indicator.type}-${indicator.id}-${indicator.windowSize}`] = c;
								d[`indicator-${indicator.id}`] = c;
							})
							// .accessor(d => d[`${indicator.type}-${indicator.id}-${indicator.windowSize}`]);
							.accessor(d => d[`indicator-${indicator.id}`])
					);
				}
				// !!check if id is always in the correct location in the array
				return this.state.indicators[index];
			});

			const maxUnstablePeriod = getMaxUndefined(indicators);
			console.log('MAX-----', maxUnstablePeriod);
			// /* SERVER - START */
			// const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxUnstablePeriod);

			// const {startPoint} = this.state;

			const startPoint = -LENGTH_TO_SHOW - maxUnstablePeriod;
			/* SERVER - START */

			const dataToCalculate = inputData.slice(startPoint);
			// console.log({startPoint});

			// const calculatedData = ema26(ema12(macdCalculator(smaVolume50(dataToCalculate))));
			// const calculatedData = indicators[0](indicators[1](dataToCalculate));

			// console.log({dataToCalculate});

			const calculatedData = pipe(...indicators)(dataToCalculate);

			// console.log({calculatedData});

			const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

			// console.log(inputData.length, dataToCalculate.length, maxUnstablePeriod)
			const {index} = indexCalculator(calculatedData);

			/* SERVER - END */

			const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);
			const {
				data: linearData,
				xScale,
				xAccessor,
				displayXAccessor,
			} = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

			// console.log(linearData.length)
			// console.log({linearData});

			this.setState({
				indicators,
				data: linearData,
				xScale,
				xAccessor,
				displayXAccessor,
			});
		}
	}

	render() {
		const {type, width, ratio, height} = this.props;

		const {data, indicators, xScale, xAccessor, displayXAccessor} = this.state;

		const {data: inputData, indicatorConfigurations} = this.props;

		return (
			<>
				<ChartCanvas
					ratio={ratio}
					width={width}
					height={600}
					margin={{left: 70, right: 70, top: 20, bottom: 30}}
					type={type}
					seriesName='MSFT'
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					onLoadMore={this.handleDownloadMore}
				>
					<Chart
						id={1}
						height={400}
						// yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
						yExtents={[
							d => [d.high, d.low],
							[...indicators.map(indicator => indicator.accessor())],
						]}
						padding={{top: 10, bottom: 20}}
					>
						{/* <XAxis axisAt='bottom' orient='bottom' showTicks={false} outerTickSize={0} />
					<YAxis axisAt='right' orient='right' ticks={5} /> */}
						<XAxis axisAt='bottom' orient='bottom' />
						<YAxis axisAt='left' orient='left' ticks={5} />

						<MouseCoordinateY at='left' orient='left' displayFormat={format('.2f')} />
						<MouseCoordinateX
							at='bottom'
							orient='bottom'
							displayFormat={timeFormat('%Y-%m-%d')}
						/>

						<CandlestickSeries />
						{indicators.map(indicator => {
							return (
								<LineSeries
									yAccessor={indicator.accessor()}
									stroke={indicator.stroke()}
									key={indicator.id()}
								/>
							);
						})}

						{indicators.map(indicator => {
							return (
								<CurrentCoordinate
									yAccessor={indicator.accessor()}
									fill={indicator.stroke()}
									key={indicator.id()}
								/>
							);
						})}

						<EdgeIndicator
							itemType='last'
							orient='right'
							edgeAt='right'
							yAccessor={d => d.close}
							fill={d => (d.close > d.open ? '#6BA583' : '#FF0000')}
						/>

						<OHLCTooltip origin={[-40, 0]} />
						<MovingAverageTooltip
							// onClick={e => console.log(e)}
							onClick={e => {
								// this.show();

								console.log(e, 'e');
								// console.log(this.state.ema12.id(), this.state.ema12.options(), 'id');
								// let indicatorName;
								// Object.keys(this.state).some(key => {
								// 	try {
								// 		console.log(key, this.state[key].id(), e.chartId, 'ci');

								// 		if (this.state[key].id() === e.chartId) {
								// 			indicatorName = key;
								// 			return true;
								// 		}
								// 	} catch (e) {
								// 		//not an indicator
								// 	}
								// });

								const {indicatorName, id} = e;

								this.show(id);
								console.log(indicatorName, 'indicatorName', id, 'id');

								// // ema26.options({windowSize: 50});
								// // const ema26 = ema()
								// // 	.id(0)
								// // 	.options({windowSize: 1, sourcePath: 'high'})
								// // 	.merge((d, c) => {
								// // 		d.ema26 = c;
								// // 	})
								// // 	.accessor(d => d.ema26);
								// // const ema26 = this.state.ema26.options({windowSize: 1, sourcePath: 'high'});
								// // console.log(ema26.merge(), 'ac');

								// const updatedIndicator = this.state[indicatorName].options({
								// 	windowSize: 1,
								// 	sourcePath: 'high',
								// });

								// const updatedIndicator = this.state[indicatorName].options({
								// 	windowSize: 1,
								// 	sourcePath: 'high',
								// });

								// // const maxUnstablePeriod = getMaxUndefined([ema26]);

								// const maxUnstablePeriod = getMaxUndefined([updatedIndicator]);
								// // console.log('MAX-----', maxUnstablePeriod);
								// /* SERVER - START */
								// const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxUnstablePeriod);

								// // const calculatedData = ema26(dataToCalculate);
								// const calculatedData = updatedIndicator(dataToCalculate);
								// // console.log('calculatedData-----', calculatedData);
								// const indexCalculator =
								// 	discontinuousTimeScaleProviderBuilder().indexCalculator();

								// // console.log(inputData.length, dataToCalculate.length, maxUnstablePeriod)
								// const {index} = indexCalculator(calculatedData);
								// /* SERVER - END */

								// const xScaleProvider =
								// 	discontinuousTimeScaleProviderBuilder().withIndex(index);
								// const {
								// 	data: linearData,
								// 	xScale,
								// 	xAccessor,
								// 	displayXAccessor,
								// } = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

								// // console.log(head(linearData), last(linearData))
								// // console.log(linearData.length)

								// // this.setState({
								// // 	ema26,
								// // 	data: linearData,
								// // 	xScale,
								// // 	xAccessor,
								// // 	displayXAccessor,
								// // });
								// this.setState({
								// 	updatedIndicator,
								// 	data: linearData,
								// 	xScale,
								// 	xAccessor,
								// 	displayXAccessor,
								// });
							}}
							origin={[-38, 15]}
							options={indicators.map(indicator => {
								return {
									yAccessor: indicator.accessor(),
									type: indicator.type(),
									stroke: indicator.stroke(),
									...indicator.options(),
									id: indicator.id(),
									indicatorName: indicator.id(),
								};
							})}
						/>
					</Chart>
					{/* 
				<Chart
					id={2}
					height={150}
					yExtents={[d => d.volume, smaVolume50.accessor()]}
					origin={(w, h) => [0, h - 300]}
				>
					<YAxis axisAt='left' orient='left' ticks={5} tickFormat={format('.2s')} />

					<MouseCoordinateY at='left' orient='left' displayFormat={format('.4s')} />

					<BarSeries
						yAccessor={d => d.volume}
						fill={d => (d.close > d.open ? '#6BA583' : '#FF0000')}
					/>
					<AreaSeries
						yAccessor={smaVolume50.accessor()}
						stroke={smaVolume50.stroke()}
						fill={smaVolume50.fill()}
					/>
				</Chart>
				
				<Chart
					id={3}
					height={150}
					yExtents={macdCalculator.accessor()}
					origin={(w, h) => [0, h - 150]}
					padding={{top: 10, bottom: 10}}
				>
					<XAxis axisAt='bottom' orient='bottom' />
					<YAxis axisAt='right' orient='right' ticks={2} />

					<MouseCoordinateX
						at='bottom'
						orient='bottom'
						displayFormat={timeFormat('%Y-%m-%d')}
					/>
					<MouseCoordinateY at='right' orient='right' displayFormat={format('.2f')} />

					<MACDSeries yAccessor={d => d.macd} {...macdAppearance} />
					<MACDTooltip
						origin={[-38, 15]}
						yAccessor={d => d.macd}
						options={macdCalculator.options()}
						appearance={macdAppearance}
					/>
				</Chart>
				*/}
					<CrossHairCursor />
				</ChartCanvas>

				{this.state.visible || this.state.visible === 0 ? (
					<Modal
						inactive={this.state.inactive}
						style={{height: '60%', width: '50%'}}
						onClose={this.hide}
					>
						<ChartIndicatorConfigurationForm
							indicator={this.state.visible}
							closeForm={this.closeForm}
						/>
					</Modal>
				) : null}
			</>
		);
	}
}

CandleStickChartPanToLoadMore.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

CandleStickChartPanToLoadMore.defaultProps = {
	type: 'svg',
};

CandleStickChartPanToLoadMore = fitWidth(CandleStickChartPanToLoadMore);

const mapStateToProps = state => ({
	indicatorConfigurations: getChartIndicatorConfigs(state),
});

// export default CandleStickChartPanToLoadMore;

export default connect(mapStateToProps)(CandleStickChartPanToLoadMore);
