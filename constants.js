let {updateLists, universes} = require('./webscraper');
const dbConnect = require('./dbConnect');

// updateLists().then(updatedUniverses => (universes = updatedUniverses));

const INTERVALS = [
	'Monthly',
	'Weekly',
	'Daily',
	'4 Hourly',
	'Hourly',
	'30 Min',
	'5 Min',
	'1 Min',
];

const SP500 = universes.sp500 || [
	'MMM',
	'AOS',
	'ABT',
	'ABBV',
	'ABMD',
	'ACN',
	'ATVI',
	'ADBE',
	'AAP',
	'AMD',
	'AES',
	'AFL',
	'A',
	'APD',
	'AKAM',
	'ALK',
	'ALB',
	'ARE',
	'ALXN',
	'ALGN',
	'ALLE',
	'LNT',
	'ALL',
	'GOOGL',
	'GOOG',
	'MO',
	'AMZN',
	'AMCR',
	'AEE',
	'AAL',
	'AEP',
	'AXP',
	'AIG',
	'AMT',
	'AWK',
	'AMP',
	'ABC',
	'AME',
	'AMGN',
	'APH',
	'ADI',
	'ANSS',
	'ANTM',
	'AON',
	'APA',
	'AAPL',
	'AMAT',
	'APTV',
	'ADM',
	'ANET',
	'AJG',
	'AIZ',
	'T',
	'ATO',
	'ADSK',
	'ADP',
	'AZO',
	'AVB',
	'AVY',
	'BKR',
	'BLL',
	'BAC',
	'BAX',
	'BDX',
	'BRK.B',
	'BBY',
	'BIO',
	'BIIB',
	'BLK',
	'BA',
	'BKNG',
	'BWA',
	'BXP',
	'BSX',
	'BMY',
	'AVGO',
	'BR',
	'BF.B',
	'CHRW',
	'COG',
	'CDNS',
	'CPB',
	'COF',
	'CAH',
	'KMX',
	'CCL',
	'CARR',
	'CTLT',
	'CAT',
	'CBOE',
	'CBRE',
	'CDW',
	'CE',
	'CNC',
	'CNP',
	'CERN',
	'CF',
	'SCHW',
	'CHTR',
	'CVX',
	'CMG',
	'CB',
	'CHD',
	'CI',
	'CINF',
	'CTAS',
	'CSCO',
	'C',
	'CFG',
	'CTXS',
	'CME',
	'CMS',
	'KO',
	'CTSH',
	'CL',
	'CMCSA',
	'CMA',
	'CAG',
	'COP',
	'ED',
	'STZ',
	'CPRT',
	'GLW',
	'CTVA',
	'COST',
	'CCI',
	'CSX',
	'CMI',
	'CVS',
	'DHI',
	'DHR',
	'DRI',
	'DVA',
	'DE',
	'DAL',
	'XRAY',
	'DVN',
	'DXCM',
	'FANG',
	'DLR',
	'DFS',
	'DISCA',
	'DISCK',
	'DISH',
	'DG',
	'DLTR',
	'D',
	'DPZ',
	'DOV',
	'DOW',
	'DTE',
	'DUK',
	'DRE',
	'DD',
	'DXC',
	'EMN',
	'ETN',
	'EBAY',
	'ECL',
	'EIX',
	'EW',
	'EA',
	'EMR',
	'ENPH',
	'ETR',
	'EOG',
	'EFX',
	'EQIX',
	'EQR',
	'ESS',
	'EL',
	'ETSY',
	'RE',
	'EVRG',
	'ES',
	'EXC',
	'EXPE',
	'EXPD',
	'EXR',
	'XOM',
	'FFIV',
	'FB',
	'FAST',
	'FRT',
	'FDX',
	'FIS',
	'FITB',
	'FRC',
	'FE',
	'FISV',
	'FLT',
	'FLIR',
	'FLS',
	'FMC',
	'F',
	'FTNT',
	'FTV',
	'FBHS',
	'FOXA',
	'FOX',
	'BEN',
	'FCX',
	'GPS',
	'GRMN',
	'IT',
	'GD',
	'GE',
	'GIS',
	'GM',
	'GPC',
	'GILD',
	'GPN',
	'GL',
	'GS',
	'GWW',
	'HAL',
	'HBI',
	'HIG',
	'HAS',
	'HCA',
	'PEAK',
	'HSIC',
	'HES',
	'HPE',
	'HLT',
	'HFC',
	'HOLX',
	'HD',
	'HON',
	'HRL',
	'HST',
	'HWM',
	'HPQ',
	'HUM',
	'HBAN',
	'HII',
	'IEX',
	'IDXX',
	'INFO',
	'ITW',
	'ILMN',
	'INCY',
	'IR',
	'INTC',
	'ICE',
	'IBM',
	'IFF',
	'IP',
	'IPG',
	'INTU',
	'ISRG',
	'IVZ',
	'IPGP',
	'IQV',
	'IRM',
	'JBHT',
	'JKHY',
	'J',
	'SJM',
	'JNJ',
	'JCI',
	'JPM',
	'JNPR',
	'KSU',
	'K',
	'KEY',
	'KEYS',
	'KMB',
	'KIM',
	'KMI',
	'KLAC',
	'KHC',
	'KR',
	'LB',
	'LHX',
	'LH',
	'LRCX',
	'LW',
	'LVS',
	'LEG',
	'LDOS',
	'LEN',
	'LLY',
	'LNC',
	'LIN',
	'LYV',
	'LKQ',
	'LMT',
	'L',
	'LOW',
	'LUMN',
	'LYB',
	'MTB',
	'MRO',
	'MPC',
	'MKTX',
	'MAR',
	'MMC',
	'MLM',
	'MAS',
	'MA',
	'MXIM',
	'MKC',
	'MCD',
	'MCK',
	'MDT',
	'MRK',
	'MET',
	'MTD',
	'MGM',
	'MCHP',
	'MU',
	'MSFT',
	'MAA',
	'MHK',
	'TAP',
	'MDLZ',
	'MPWR',
	'MNST',
	'MCO',
	'MS',
	'MSI',
	'MSCI',
	'NDAQ',
	'NTAP',
	'NFLX',
	'NWL',
	'NEM',
	'NWSA',
	'NWS',
	'NEE',
	'NLSN',
	'NKE',
	'NI',
	'NSC',
	'NTRS',
	'NOC',
	'NLOK',
	'NCLH',
	'NOV',
	'NRG',
	'NUE',
	'NVDA',
	'NVR',
	'ORLY',
	'OXY',
	'ODFL',
	'OMC',
	'OKE',
	'ORCL',
	'OTIS',
	'PCAR',
	'PKG',
	'PH',
	'PAYX',
	'PAYC',
	'PYPL',
	'PNR',
	'PBCT',
	'PEP',
	'PKI',
	'PRGO',
	'PFE',
	'PM',
	'PSX',
	'PNW',
	'PXD',
	'PNC',
	'POOL',
	'PPG',
	'PPL',
	'PFG',
	'PG',
	'PGR',
	'PLD',
	'PRU',
	'PEG',
	'PSA',
	'PHM',
	'PVH',
	'QRVO',
	'QCOM',
	'PWR',
	'DGX',
	'RL',
	'RJF',
	'RTX',
	'O',
	'REG',
	'REGN',
	'RF',
	'RSG',
	'RMD',
	'RHI',
	'ROK',
	'ROL',
	'ROP',
	'ROST',
	'RCL',
	'SPGI',
	'CRM',
	'SBAC',
	'SLB',
	'STX',
	'SEE',
	'SRE',
	'NOW',
	'SHW',
	'SPG',
	'SWKS',
	'SLG',
	'SNA',
	'SO',
	'LUV',
	'SWK',
	'SBUX',
	'STT',
	'STE',
	'SYK',
	'SIVB',
	'SYF',
	'SNPS',
	'SYY',
	'TMUS',
	'TROW',
	'TTWO',
	'TPR',
	'TGT',
	'TEL',
	'TDY',
	'TFX',
	'TER',
	'TSLA',
	'TXN',
	'TXT',
	'BK',
	'CLX',
	'COO',
	'HSY',
	'MOS',
	'TRV',
	'DIS',
	'TMO',
	'TJX',
	'TSCO',
	'TT',
	'TDG',
	'TRMB',
	'TFC',
	'TWTR',
	'TYL',
	'TSN',
	'USB',
	'UDR',
	'ULTA',
	'UAA',
	'UA',
	'UNP',
	'UAL',
	'UPS',
	'URI',
	'UNH',
	'UHS',
	'UNM',
	'VLO',
	'VTR',
	'VRSN',
	'VRSK',
	'VZ',
	'VRTX',
	'VFC',
	'VIAC',
	'VTRS',
	'V',
	'VNT',
	'VNO',
	'VMC',
	'WRB',
	'WBA',
	'WMT',
	'WM',
	'WAT',
	'WEC',
	'WFC',
	'WELL',
	'WST',
	'WDC',
	'WU',
	'WAB',
	'WRK',
	'WY',
	'WHR',
	'WMB',
	'WLTW',
	'WYNN',
	'XEL',
	'XRX',
	'XLNX',
	'XYL',
	'YUM',
	'ZBRA',
	'ZBH',
	'ZION',
	'ZTS',
];

const NAS100 = universes.nas100 || [
	'AAL',
	'AAPL',
	'ADBE',
	'ADI',
	'ADP',
	'ADSK',
	'ALGN',
	'ALXN',
	'AMAT',
	'AMD',
	'AMGN',
	'AMZN',
	'ASML',
	'ATVI',
	'AVGO',
	'BIDU',
	'BIIB',
	'BKNG',
	'BMRN',
	'CDNS',
	'BMY', //CELG changed to BMY
	'CERN',
	'CHKP',
	'CHTR',
	'CMCSA',
	'COST',
	'CSCO',
	'CSX',
	'CTAS',
	'TCOM', //CTRP changed to TCOM
	'CTSH',
	'CTXS',
	'DLTR',
	'EA',
	'EBAY',
	'EXPE',
	'FAST',
	'FB',
	'FISV',
	'FOX',
	'FOXA',
	'GILD',
	'GOOG',
	'GOOGL',
	'HAS',
	'HSIC',
	'IDXX',
	'ILMN',
	'INCY',
	'INTC',
	'INTU',
	'ISRG',
	'JBHT',
	'JD',
	'KHC',
	'KLAC',
	'LBTYA',
	'LBTYK',
	'LRCX',
	'LULU',
	'MAR',
	'MCHP',
	'MDLZ',
	'MELI',
	'MNST',
	'MSFT',
	'MU',
	'MXIM',
	'VTRS', // MYL changed to VTRS
	'NFLX',
	'NTAP',
	'NTES',
	'NVDA',
	'NXPI',
	'ORLY',
	'PAYX',
	'PCAR',
	'PEP',
	'PYPL',
	'QCOM',
	'REGN',
	'ROST',
	'SBUX',
	'SIRI',
	'SNPS',
	'SWKS',
	// 'PCL', // SYMC changed to PCL //removed
	'TMUS',
	'TSLA',
	'TTWO',
	'TXN',
	'UAL',
	'ULTA',
	'VRSK',
	'VRSN',
	'VRTX',
	'WBA',
	'WDAY',
	'WDC',
	'WLTW',
	'WYNN',
	'XEL',
	'XLNX',
	'ZM', // added
];

const DJ30 = universes.dj30 || [
	'AAPL',
	'CSCO',
	'INTC',
	'MSFT',
	'WBA',
	'AXP',
	'BA',
	'CAT',
	'CVX',
	'DIS',
	'DOW',
	'GS',
	'HD',
	'IBM',
	'JNJ',
	'JPM',
	'KO',
	'MCD',
	'MMM',
	'MRK',
	'NKE',
	'PFE',
	'PG',
	'TRV',
	'UNH',
	'RTX', //UTX renamed to RTX
	'V',
	'VZ',
	'WMT',
	'XOM',
];

let UNIVERSES = {
	SP500,
	NAS100,
	DJ30,
};

// const UNIVERSES = () => ({
// 	SP500: SP500 || universes.sp500,
// 	NAS100: NAS100 || universes.nas100,
// 	DJ30: DJ30 || universes.dj30,
// });

// const SYMBOLS = Object.keys(UNIVERSES).flatMap(universe => [...UNIVERSES[universe]]); //[...SP500, ...NAS100, ...DJ30];
// const SYMBOLS = [...new Set([...SP500, ...NAS100, ...DJ30])];
// const SYMBOLS = [
// 	...new Set([...Object.keys(UNIVERSES).flatMap(universe => [...UNIVERSES[universe]])]),
// ];

const convertUniverseToSymbols = () => [
	...new Set([...Object.keys(UNIVERSES).flatMap(universe => [...UNIVERSES[universe]])]),
];

let SYMBOLS = convertUniverseToSymbols();

let transformedUniverse = {
	SP500: universes.sp500,
	NAS100: universes.nas100,
	DJ30: universes.dj30,
};

const transformUniverse = universes => {
	transformedUniverse.SP500 = universes.sp500;
	transformedUniverse.NAS100 = universes.nas100;
	transformedUniverse.DJ30 = universes.dj30;
};

async function updateUNIVERSESfromDB() {
	const symbols = await dbConnect.retrieveSymbolData();
	// const symbols = [
	// 	{ticker: 'a', DJ30: false, NAS100: false, SP500: true},
	// 	{ticker: 'b', DJ30: false, NAS100: false, SP500: true},
	// ];
	// console.log({symbols}, symbols.length);

	SYMBOLS.splice(symbols.length);

	for (let i = 0; i < symbols.length; i++) {
		const stock = symbols[i];
		SYMBOLS[i] = stock.ticker;
	}

	// console.log(SYMBOLS, 'map');
	UNIVERSES.SP500 = symbols.filter(stock => stock.SP500).map(stock => stock.ticker);
	UNIVERSES.NAS100 = symbols.filter(stock => stock.NAS100).map(stock => stock.ticker);
	UNIVERSES.DJ30 = symbols.filter(stock => stock.DJ30).map(stock => stock.ticker);
}

async function updateAndInsertUNIVERSES() {
	// run the webscraper to update all stock universes
	universes = await updateLists();
	// db requires uppercase keys - transform universes object to required format
	transformUniverse(universes);
	// insert the updated stock universe list into the table
	await dbConnect.insertIntoTableSymbols(transformedUniverse);

	await updateUNIVERSESfromDB();
}

let timerId = setInterval(async () => {
	await updateAndInsertUNIVERSES();
}, 60 * 1000 * 60 * 24);

dbConnect.insertIntoTableSymbols(transformedUniverse);
updateUNIVERSESfromDB();

const UNSTABLEPERIOD = 30;

const API_TO_INDICATORS = {
	'52WkHigh': '52 Week High',
	'52WkLow': '52 Week Low',
	askPrice: 'Ask Price',
	askSize: 'Ask Size',
	assetType: 'Asset Type',
	bidPrice: 'Bid Price',
	bidSize: 'Bid Size',
	closePrice: 'Close Price',
	divAmount: 'Dividend Amount',
	divDate: 'Dividend Date',
	divYield: 'Dividend Yield',
	exchangeName: 'Exchange',
	highPrice: 'High Price',
	lastPrice: 'Last Price',
	lastSize: 'Last Size',
	lowPrice: 'Low Price',
	mark: 'Mark',
	markChangeInDouble: 'Mark Change',
	markPercentChangeInDouble: 'Mark Change (%)',
	nAV: 'Net Asset Value',
	netChange: 'Net Change',
	netPercentChangeInDouble: 'Net Change (%)',
	openPrice: 'Open Price',
	peRatio: 'PE Ratio',
	totalVolume: 'Volume',
	volatility: 'Volatility',
};

const INDICATORS_TO_API = {
	'52 Week High': '52WkHigh',
	'52 Week Low': '52WkLow',
	'Ask Price': 'askPrice',
	'Ask Size': 'askSize',
	'Asset Type': 'assetType',
	'Bid Price': 'bidPrice',
	'Bid Size': 'bidSize',
	'Close Price': 'closePrice',
	'Dividend Amount': 'divAmount',
	'Dividend Date': 'divDate',
	'Dividend Yield': 'divYield',
	Exchange: 'exchangeName',
	'High Price': 'highPrice',
	'Last Price': 'lastPrice',
	'Last Size': 'lastSize',
	'Low Price': 'lowPrice',
	Mark: 'mark',
	'Mark Change': 'markChangeInDouble',
	'Mark Change (%)': 'markPercentChangeInDouble',
	'Net Asset Value': 'nAV',
	'Net Change': 'netChange',
	'Net Change (%)': 'netPercentChangeInDouble',
	'Open Price': 'openPrice',
	'PE Ratio': 'peRatio',
	Volume: 'totalVolume',
	Volatility: 'volatility',
};

module.exports = {
	UNIVERSES,
	SYMBOLS,
	UNSTABLEPERIOD,
	API_TO_INDICATORS,
};
