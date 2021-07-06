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
	ema: ema,
	sma: sma,
	macd: macd,
};

class CandleStickChartPanToLoadMore extends React.Component {
	constructor(props) {
		super(props);
		const {data: inputData} = props;

		const {indicatorConfigurations} = props;
		console.log({indicatorConfigurations});

		// const ema26 = ema()
		// 	.id(0)
		// 	.options({windowSize: 26})
		// 	.merge((d, c) => {
		// 		// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');
		// 		d.ema26 = c;
		// 	})
		// 	.accessor(d => d.ema26);

		// const ema12 = ema()
		// 	.id(1)
		// 	.options({windowSize: 12})
		// 	.merge((d, c) => {
		// 		d.ema12 = c;
		// 	})
		// 	.accessor(d => d.ema12);

		// const macdCalculator = macd()
		// 	.options({
		// 		fast: 12,
		// 		slow: 26,
		// 		signal: 9,
		// 	})
		// 	.merge((d, c) => {
		// 		d.macd = c;
		// 	})
		// 	.accessor(d => d.macd);

		// const smaVolume50 = sma()
		// 	.id(3)
		// 	.options({
		// 		windowSize: 50,
		// 		sourcePath: 'volume',
		// 	})
		// 	.merge((d, c) => {
		// 		d.smaVolume50 = c;
		// 	})
		// 	.accessor(d => d.smaVolume50);

		// const indicators = {ema26, ema12, macdCalculator, smaVolume50};

		// const maxWindowSize = getMaxUndefined([ema26, ema12, macdCalculator, smaVolume50]);

		// const indicators = [
		// 	ema()
		// 		.id(0)
		// 		.options({windowSize: 1})
		// 		.merge((d, c) => {
		// 			// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');
		// 			d.ema26 = c;
		// 		})
		// 		.accessor(d => d.ema26),
		// 	ema()
		// 		.id(1)
		// 		.options({windowSize: 20})
		// 		.merge((d, c) => {
		// 			d.ema12 = c;
		// 		})
		// 		.accessor(d => d.ema12),
		// ];

		// const indicators = indicatorConfigurations.map(indicator => {
		// 	return ema()
		// 		.id(indicator.id)
		// 		.options({windowSize: indicator.windowSize, sourcePath: indicator.sourcePath})
		// 		.merge((d, c) => {
		// 			// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');
		// 			// d.ema26 = c;

		// 			d[`${indicator.type}${indicator.windowSize}`];
		// 		})
		// 		.accessor(d => d[`${indicator.type}${indicator.windowSize}`]);
		// 	// .accessor(d => d.ema26)
		// });

		// console.log(indicatorFunctions.ema(), 'indicatorFunctions');

		const indicators = indicatorConfigurations.map(indicator => {
			// console.log(
			// 	{indicator},
			// 	indicator.windowSize,
			// 	`${indicator.type}${indicator.windowSize}`
			// );
			return (
				//ema()
				indicatorFunctions[indicator.type]()
					.id(indicator.id)
					.options({windowSize: indicator.windowSize})
					.merge((d, c) => {
						// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');
						// d.ema1 = c;
						d[`${indicator.type}${indicator.windowSize}`] = c;
					})
					// .accessor(d => {
					// 	console.log(`${indicator.type}${indicator.windowSize}`, 'acc');
					// 	return d.ema1;
					// });
					.accessor(d => d[`${indicator.type}${indicator.windowSize}`])
			);
			// return ema()
			// 	.id(indicator.id)
			// 	.options({windowSize: indicator.windowSize, sourcePath: indicator.sourcePath})
			// 	.merge((d, c) => {
			// 		// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');
			// 		// d.ema26 = c;

			// 		d[`${indicator.type}${indicator.windowSize}`];
			// 	})
			// 	.accessor(d => d[`${indicator.type}${indicator.windowSize}`]);
			// // .accessor(d => d.ema26)
		});

		// console.log(test, 't', test[0].id(), test[0].options(), test[0].accessor());

		// const indicators = [
		// 	ema()
		// 		.id(0)
		// 		.options({windowSize: 1})
		// 		.merge((d, c) => {
		// 			// console.log('c=ema26', c, 'd=the full candle incl. indicators', d, 'dc');
		// 			d.ema26 = c;
		// 		})
		// 		.accessor(d => d.ema26),
		// 	ema()
		// 		.id(1)
		// 		.options({windowSize: 20})
		// 		.merge((d, c) => {
		// 			d.ema12 = c;
		// 		})
		// 		.accessor(d => d.ema12),
		// ];

		// const maxWindowSize = 500;

		const maxWindowSize = getMaxUndefined(indicators);
		// console.log({maxWindowSize});

		/* SERVER - START */
		const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxWindowSize);

		// const calculatedData = ema26(ema12(macdCalculator(smaVolume50(dataToCalculate))));
		// const calculatedData = indicators[0](indicators[1](dataToCalculate));

		const calculatedData = pipe(...indicators)(dataToCalculate);

		const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

		// console.log(inputData.length, dataToCalculate.length, maxWindowSize)
		const {index} = indexCalculator(calculatedData);
		/* SERVER - END */

		const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(index);
		const {
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

		// console.log(head(linearData), last(linearData))
		// console.log(linearData.length)

		this.state = {
			indicators,
			// ...indicators,
			// linearData, //-->appears not to be needed
			data: linearData,
			xScale,
			xAccessor,
			displayXAccessor,
			visible: false,
			inactive: false,
		};

		// this.state = {
		// 	ema26,
		// 	ema12,
		// 	macdCalculator,
		// 	smaVolume50,
		// 	// linearData, //-->appears not to be needed
		// 	data: linearData,
		// 	xScale,
		// 	xAccessor,
		// 	displayXAccessor,
		// };

		console.log('s', this.state);
		// this.handleDownloadMore = this.handleDownloadMore.bind(this);
	}

	// // handleDownloadMore(start, end) {
	// handleDownloadMore = (start, end) => {
	// 	console.log(start, end, 'start, end');
	// 	if (Math.ceil(start) === end) return;
	// 	// console.log("rows to download", rowsToDownload, start, end)
	// 	const {data: prevData, ema26, ema12, macdCalculator, smaVolume50} = this.state;
	// 	const {data: inputData} = this.props;

	// 	if (inputData.length === prevData.length) return;

	// 	const rowsToDownload = end - Math.ceil(start);

	// 	const maxWindowSize = getMaxUndefined([ema26, ema12, macdCalculator, smaVolume50]);

	// 	/* SERVER - START */
	// 	const dataToCalculate = inputData.slice(
	// 		-rowsToDownload - maxWindowSize - prevData.length,
	// 		-prevData.length
	// 	);

	// 	const calculatedData = ema26(ema12(macdCalculator(smaVolume50(dataToCalculate))));
	// 	const indexCalculator = discontinuousTimeScaleProviderBuilder()
	// 		.initialIndex(Math.ceil(start))
	// 		.indexCalculator();
	// 	const {index} = indexCalculator(
	// 		calculatedData.slice(-rowsToDownload).concat(prevData)
	// 	);
	// 	/* SERVER - END */

	// 	const xScaleProvider = discontinuousTimeScaleProviderBuilder()
	// 		.initialIndex(Math.ceil(start))
	// 		.withIndex(index);

	// 	const {
	// 		data: linearData,
	// 		xScale,
	// 		xAccessor,
	// 		displayXAccessor,
	// 	} = xScaleProvider(calculatedData.slice(-rowsToDownload).concat(prevData));

	// 	// console.log(linearData.length)
	// 	setTimeout(() => {
	// 		// simulate a lag for ajax
	// 		this.setState({
	// 			data: linearData,
	// 			xScale,
	// 			xAccessor,
	// 			displayXAccessor,
	// 		});
	// 	}, 300);
	// };

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

	render() {
		const {type, width, ratio, height} = this.props;

		const {
			data,
			indicators,
			// macdCalculator,
			// smaVolume50,
			xScale,
			xAccessor,
			displayXAccessor,
		} = this.state;

		const {data: inputData} = this.props;

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
					// onLoadMore={this.handleDownloadMore}
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

								// // const maxWindowSize = getMaxUndefined([ema26]);

								// const maxWindowSize = getMaxUndefined([updatedIndicator]);
								// // console.log('MAX-----', maxWindowSize);
								// /* SERVER - START */
								// const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxWindowSize);

								// // const calculatedData = ema26(dataToCalculate);
								// const calculatedData = updatedIndicator(dataToCalculate);
								// // console.log('calculatedData-----', calculatedData);
								// const indexCalculator =
								// 	discontinuousTimeScaleProviderBuilder().indexCalculator();

								// // console.log(inputData.length, dataToCalculate.length, maxWindowSize)
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
