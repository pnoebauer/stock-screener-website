import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';

import {ChartCanvas, Chart, ZoomButtons} from 'react-stockcharts';

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
	SingleValueTooltip,
	ToolTipText,
} from 'react-stockcharts/lib/tooltip';
import {ema, sma, wma, tma, macd, atr, mom} from 'react-stockcharts/lib/indicator';
import {fitWidth} from 'react-stockcharts/lib/helper';

import Modal from '../portal-modal/modal.component';
import ChartIndicatorConfigurationForm from '../chart-indicator-config/chart-indicator-config.component';

import {getChartIndicatorConfigs} from '../../redux/chart/chart.selectors';

import {MAIN_CHART_INDICATORS} from '../../assets/constants';

const canvasMargin = {left: 70, right: 70, top: 20, bottom: 30};
const mainChartPadding = {top: 20, bottom: 20};
const subChartPadding = {top: 10, bottom: 20};

function getMaxUndefined(calculators) {
	try {
		return calculators
			.map(each => {
				try {
					return each.undefinedLength();
				} catch (e) {
					return 0;
				}
			})
			.reduce((a, b) => Math.max(a, b));
	} catch (e) {
		return 1;
	}
}

const pipe =
	(...fns) =>
	x =>
		fns.reduce((v, f) => f(v), x);

const LENGTH_TO_SHOW = 880;

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
	wma,
	tma,
	macd,
	atr,
	mom,
};

class CandleStickChartPanToLoadMore extends React.Component {
	constructor(props) {
		super(props);
		const {data: inputData} = props;

		// console.log({inputData: inputData.length});
		// console.log({inputData: inputData});

		const {indicatorConfigurations} = props;
		// console.log({indicatorConfigurations});

		const indicators = indicatorConfigurations.map(indicator => {
			const {id, type, ...optionsConfig} = indicator;
			// console.log({id, type, ...optionsConfig});
			return (
				indicatorFunctions[type]()
					.id(id)
					// .options({windowSize: indicator.windowSize})
					.options({...optionsConfig})
					.merge((d, c) => {
						// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');

						// d[`${type}-${id}-${indicator.windowSize}`] = c;
						d[`indicator-${id}`] = c;
					})
					// .accessor(d => d[`${type}-${id}-${indicator.windowSize}`]);
					.accessor(d => d[`indicator-${id}`])
			);
		});

		const maxUnstablePeriod = getMaxUndefined(indicators);
		// console.log({maxUnstablePeriod});

		const startPoint = -LENGTH_TO_SHOW - maxUnstablePeriod;

		/* SERVER - START */
		// retrieves the last X candles from the data series
		const dataToCalculate = inputData.slice(startPoint);
		// console.log({startPoint});

		// add the indicator values to each candle
		const calculatedData = pipe(...indicators)(dataToCalculate);

		// console.log({length: calculatedData.length, calculatedData});

		const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

		// /Users/Phil/Desktop/Web Dev/Projects/stock-screener/client/node_modules/react-stockcharts/lib/scale//level.js
		// adds index to series and level (level depends on the date, i.e. odd days = 11, even days = 12, start of week = 13, start of month = 14)
		const {index} = indexCalculator(calculatedData.slice(maxUnstablePeriod));
		// const {index} = indexCalculator(calculatedData);
		// console.log({index});

		/* SERVER - END */

		// add index to the data series
		const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);

		// console.log({xScaleProvider: xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW))});

		const {
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
			// } = xScaleProvider(calculatedData);
			// } = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));
		} = xScaleProvider(calculatedData.slice(maxUnstablePeriod));

		// console.log({xScale});
		// console.log(
		// 	linearData.length,
		// 	'linearData.length',
		// 	maxUnstablePeriod,
		// 	LENGTH_TO_SHOW
		// );

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
			start: 0,
			// suffix: 1,
		};

		// console.log('s', this.state);

		this.saveNode = this.saveNode.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	handleDownloadMore = async (start, end) => {
		// console.log(start, end, 'start, end', Math.ceil(start) === end);
		if (Math.ceil(start) === end) return;
		// console.log("rows to download", rowsToDownload, start, end)

		// const {data: prevData, ema26, ema12, macdCalculator, smaVolume50} = this.state;
		const {data: prevData, indicators} = this.state;
		const {data: inputData} = this.props;

		// if (inputData.length - prevData.length < 800) {
		// 	console.log('------LOADING MORE DATA', inputData[0].date);
		// 	await this.props.loadData(inputData[0].date);
		// }

		// console.log(
		// 	{inputData, length: inputData.length, prevData, prevLength: prevData.length},
		// 	'update'
		// );
		// console.log(
		// 	{startDate: inputData[0].date, prevStartDate: prevData[0].date},
		// 	'update'
		// );

		if (inputData.length === prevData.length) {
			// await this.props.loadData(inputData[0].date);
			return;
		}

		const rowsToDownload = end - Math.ceil(start);

		const maxUnstablePeriod = getMaxUndefined(indicators);

		const startPoint = -rowsToDownload - maxUnstablePeriod - prevData.length;
		const endPoint = -prevData.length;

		/* SERVER - START */

		// same as before --> inputData.slice(-rowsToDownload - maxUnstablePeriod); --> except that window has been moved rowsToDownload to the left
		// in short: new window is rowsToDownload(=>how far the cursor moved chart to the left) plus the unstablePeriod moved to the left of the prior window
		const dataToCalculate = inputData.slice(startPoint, endPoint);

		// console.log(
		// 	'slice',
		// 	{startPoint},
		// 	{endPoint},
		// 	{rowsToDownload, maxUnstablePeriod, length: prevData.length},
		// 	{dataToCalculate}
		// );

		// add the indicator values to each candle
		const calculatedData = pipe(...indicators)(dataToCalculate);

		// console.log({calculatedData}, 'update');

		// BEFORE:
		// const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

		const indexCalculator = discontinuousTimeScaleProviderBuilder()
			.initialIndex(Math.ceil(start))
			.indexCalculator();

		// adds index to series and level (level depends on the date, i.e. odd days = 11, even days = 12, start of week = 13, start of month = 14)
		// calculatedData goes from startPoint to endPoint, which is maxUnstablePeriod+rowsToDownload
		// only want rowsToDownload as maxUnstablePeriod only serves as a lookback for calculating indicators
		const {index} = indexCalculator(
			calculatedData.slice(-rowsToDownload).concat(prevData)
		);

		// console.log({index}, 'update');

		/* SERVER - END */

		// BEFORE:
		// const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);

		// add index to the data series
		const xScaleProvider = discontinuousTimeScaleProviderBuilder()
			.initialIndex(Math.ceil(start))
			.withIndex(index);

		// console.log(
		// 	{
		// 		xScaleProvider: xScaleProvider(
		// 			calculatedData.slice(-rowsToDownload).concat(prevData)
		// 		),
		// 	},
		// 	'update'
		// );

		const {
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData.slice(-rowsToDownload).concat(prevData));

		// console.log({linearData: linearData.length}, {linearData}, 'update');

		this.setState({
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
			startPoint,
			start,
		});

		// console.log(
		// 	'------inputData.length - prevData.length',
		// 	inputData.length - prevData.length
		// );

		// if (inputData.length - prevData.length < 250) {
		// 	await this.props.loadData(inputData[0].date);
		// 	console.log('------LOADING MORE DATA', inputData[0].date);
		// }
	};

	// async componentDidMount() {
	// 	const {data: inputData} = this.props;
	// 	console.log('-----MOUNTED', this.state.data);
	// 	// await this.props.loadData(inputData[0].date);
	// }

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

	componentWillMount() {
		this.setState({
			suffix: 1,
		});
	}
	saveNode(node) {
		this.node = node;
	}
	resetYDomain() {
		this.node.resetYDomain();
	}
	handleReset() {
		this.setState(
			{
				suffix: this.state.suffix + 1,
			},
			() => console.log(this.state.suffix, 'suf')
		);
	}

	async componentDidUpdate(prevProps, prevState) {
		const {indicatorConfigurations, data: inputData} = this.props;

		const {data: prevData, indicators} = this.state;

		if (inputData.length - prevData.length < 1000) {
			// console.log('------LOADING MORE DATA', inputData[0].date);
			await this.props.loadData(inputData[0].date);

			return;
		}

		// console.log('changed', indicatorConfigurations);
		if (prevProps.indicatorConfigurations !== indicatorConfigurations) {
			// console.log('changed', indicatorConfigurations);

			const indicators = indicatorConfigurations.map((indicator, index) => {
				if (prevProps.indicatorConfigurations[index] !== indicator) {
					const {id, type, ...optionsConfig} = indicator;
					// console.log({
					// 	index,
					// 	windowSize: indicator.windowSize,
					// 	sourcePath: indicator.sourcePath,
					// 	indicator,
					// 	optionsConfig,
					// });

					return (
						indicatorFunctions[type]()
							.id(id)
							.options({
								// windowSize: indicator.windowSize,
								// sourcePath: indicator.sourcePath,
								...optionsConfig,
							})
							.merge((d, c) => {
								// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');

								// d[`${type}-${id}-${indicator.windowSize}`] = c;
								d[`indicator-${id}`] = c;
							})
							// .accessor(d => d[`${type}-${id}-${indicator.windowSize}`]);
							.accessor(d => d[`indicator-${id}`])
					);
				}
				// !!check if id is always in the correct location in the array
				return this.state.indicators[index];
			});

			const maxUnstablePeriod = getMaxUndefined(indicators);
			// console.log('MAX-----', maxUnstablePeriod);
			// /* SERVER - START */
			// const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxUnstablePeriod);

			const {startPoint, start} = this.state;

			// const startPoint = -LENGTH_TO_SHOW - maxUnstablePeriod;
			/* SERVER - START */

			const dataToCalculate = inputData.slice(startPoint);
			// console.log({startPoint});

			// console.log({dataToCalculate});

			const calculatedData = pipe(...indicators)(dataToCalculate);

			// console.log({calculatedData: calculatedData.length});

			const indexCalculator = discontinuousTimeScaleProviderBuilder()
				.initialIndex(Math.ceil(start))
				.indexCalculator();

			const {index} = indexCalculator(
				calculatedData.slice(startPoint + maxUnstablePeriod)
				// calculatedData
			);

			const xScaleProvider = discontinuousTimeScaleProviderBuilder()
				.initialIndex(Math.ceil(start))
				.withIndex(index);

			// const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

			// // console.log(inputData.length, dataToCalculate.length, maxUnstablePeriod)
			// const {index} = indexCalculator(calculatedData);

			/* SERVER - END */

			// console.log({
			// 	startPoint,
			// 	maxUnstablePeriod,
			// 	LENGTH_TO_SHOW,
			// 	plotLength: startPoint + maxUnstablePeriod,
			// });

			// const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);
			const {
				data: linearData,
				xScale,
				xAccessor,
				displayXAccessor,
			} = xScaleProvider(calculatedData.slice(startPoint + maxUnstablePeriod));
			// } = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

			// console.log({linearData: linearData.length}, {linearData}, 'config');

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

		// used for enabling/disabling zoom etc.
		const {mouseMoveEvent, panEvent, zoomEvent, zoomAnchor} = this.props;
		const {clamp} = this.props;

		const {data, indicators, xScale, xAccessor, displayXAccessor} = this.state;

		const {
			data: inputData,
			indicatorConfigurations,
			mainChartHeight,
			subChartHeight,
			stockSymbol,
		} = this.props;

		const mainIndicators = indicators.flatMap(indicator =>
			MAIN_CHART_INDICATORS.includes(indicator.type().toLowerCase()) ? [indicator] : []
		);
		const subIndicators = indicators.flatMap(indicator =>
			MAIN_CHART_INDICATORS.includes(indicator.type().toLowerCase()) ? [] : [indicator]
		);

		// console.log({data, displayXAccessor, xAccessor, xScale});

		const canvasHeight =
			canvasMargin.top +
			canvasMargin.bottom +
			mainChartPadding.top +
			mainChartPadding.bottom +
			mainChartHeight +
			subIndicators.length * (subChartHeight + subChartPadding.top);

		return (
			<>
				<ChartCanvas
					ref={this.saveNode}
					ratio={ratio}
					width={width}
					height={canvasHeight}
					margin={{...canvasMargin}}
					type={type}
					seriesName={this.props.stockSymbol}
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					onLoadMore={this.handleDownloadMore}

					seriesName={`${stockSymbol}_${this.state.suffix}`}
					mouseMoveEvent={mouseMoveEvent}
					panEvent={panEvent}
					zoomEvent={zoomEvent}
					clamp={clamp}
					zoomAnchor={zoomAnchor}
				>
					<Chart
						id={1}
						height={mainChartHeight}
						yExtents={[
							d => [d.high, d.low],
							[...mainIndicators.map(indicator => indicator.accessor())],
						]}
						padding={{...mainChartPadding}}
					>
						<XAxis axisAt='bottom' orient='bottom' zoomEnabled={zoomEvent} />
						<YAxis
							axisAt='left'
							orient='left'
							ticks={5}
							stroke='#000000'
							zoomEnabled={zoomEvent}
						/>

						<MouseCoordinateY at='left' orient='left' displayFormat={format('.2f')} />
						<MouseCoordinateX
							at='bottom'
							orient='bottom'
							displayFormat={timeFormat('%Y-%m-%d')}
						/>

						<CandlestickSeries />
						{mainIndicators.map(indicator => {
							return (
								<LineSeries
									yAccessor={indicator.accessor()}
									stroke={indicator.stroke()}
									key={indicator.id()}
								/>
							);
						})}

						{mainIndicators.map(indicator => {
							return (
								<CurrentCoordinate
									yAccessor={indicator.accessor()}
									fill={indicator.stroke()}
									key={indicator.id()}
								/>
							);
						})}

						<MovingAverageTooltip
							onClick={e => {
								// console.log(e, e.target, e.buttons, e.type, e.nativeEvent, 'e----------');
								const {id} = e;
								this.show(id);
							}}
							origin={[8, 5]}
							options={mainIndicators.map(indicator => {
								// console.log(indicator.options(), 'opt');
								return {
									yAccessor: indicator.accessor(),
									type: indicator.type(),
									stroke: indicator.stroke(),
									...indicator.options(),
									id: indicator.id(),
								};
							})}
						/>

						<EdgeIndicator
							itemType='last'
							orient='right'
							edgeAt='right'
							yAccessor={d => d.close}
							fill={d => (d.close > d.open ? '#6BA583' : '#FF0000')}
						/>

						<OHLCTooltip origin={[5, -10]}></OHLCTooltip>

						<ZoomButtons onReset={this.handleReset} />
					</Chart>

					{!!subIndicators.length &&
						subIndicators.map((subIndicator, index) => {
							return (
								<Chart
									id={`${2 + index}`}
									key={`${2 + index}`}
									height={subChartHeight}
									yExtents={subIndicator.accessor()}
									// origin={(w, h) => [0, h - 125]} the higher the number the further down the chart
									// translates the chart (overlappes with main chart with origin at zero -> move by main chart height to be exactly below)
									origin={(w, h) => {
										const top =
											mainChartHeight +
											subChartPadding.top +
											index * (subChartHeight + subChartPadding.top);
										// console.log({h, mainChartHeight});
										return [0, top];
									}}
									padding={{...subChartPadding}}
								>
									<XAxis
										axisAt='bottom'
										orient='bottom'
										opacity={0.3}
										tickStrokeOpacity={0.3}
										fontSize={10}
									/>
									<YAxis
										axisAt='right'
										orient='right'
										ticks={10}
										stroke='#000000'
										zoomEnabled={zoomEvent}
									/>
									<MouseCoordinateX
										at='bottom'
										orient='bottom'
										displayFormat={timeFormat('%Y-%m-%d')}
									/>
									<MouseCoordinateY
										at='right'
										orient='right'
										displayFormat={format('.2f')}
									/>

									{subIndicator.type() === 'MACD' && (
										<>
											<MACDSeries
												yAccessor={subIndicator.accessor()}
												{...macdAppearance}
											/>
											<MACDTooltip
												origin={[-38, 30]}
												yAccessor={subIndicator.accessor()}
												options={subIndicator.options()}
												appearance={macdAppearance}
												onClick={e => {
													const id = subIndicator.id();
													this.show(id);
												}}
											/>
										</>
									)}
									{(subIndicator.type() === 'ATR' || subIndicator.type() === 'MOM') && (
										<>
											<LineSeries
												yAccessor={subIndicator.accessor()}
												stroke={subIndicator.stroke()}
											/>
											<SingleValueTooltip
												yAccessor={subIndicator.accessor()}
												yLabel={`${subIndicator.type()} (${
													subIndicator.options().windowSize
												})`}
												yDisplayFormat={format('.2f')}
												/* valueStroke={atr14.stroke()} - optional prop */
												/* labelStroke="#4682B4" - optional prop */
												origin={[-20, 30]}
												onClick={e => {
													const id = subIndicator.id();
													this.show(id);
												}}
											/>
										</>
									)}
								</Chart>
							);
						})}

					<CrossHairCursor />
				</ChartCanvas>

				{this.state.visible || this.state.visible === 0 ? (
					<Modal
						inactive={this.state.inactive}
						style={{height: '60%', width: '50%'}}
						onClose={this.hide}
					>
						<ChartIndicatorConfigurationForm
							indicatorId={this.state.visible}
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
