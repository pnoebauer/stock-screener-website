import {tsvParse, csvParse} from 'd3-dsv';
import {timeParse} from 'd3-time-format';

function parseData(parse) {
	return function (d) {
		// d.date = parse(d.date);
		// d.open = +d.open;
		// d.high = +d.high;
		// d.low = +d.low;
		// d.close = +d.close;
		// d.volume = +d.volume;

		// console.log({d});

		// return d;

		let convObj = {};
		convObj.date = parse(d.date);
		convObj.open = +d.open;
		convObj.high = +d.high;
		convObj.low = +d.low;
		convObj.close = +d.close;
		convObj.volume = +d.volume;

		// console.log({convObj});

		return convObj;
	};
}

const parseDate = timeParse('%Y-%m-%d');

export function getData() {
	const promiseMSFT = fetch(
		'https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv'
	)
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)));
	return promiseMSFT;
}
