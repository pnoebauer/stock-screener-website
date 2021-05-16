const knex = require('knex')({
	client: 'pg',
	connection: {
		//     //--------heroku------
		//   connectionString: process.env.DATABASE_URL, //heroku
		//   ssl: {
		//       rejectUnauthorized: false
		//     },
		//   //--------heroku------
		host: '127.0.0.1', // host: '127.0.0.1' (localhost)
		user: '',
		password: '',
		database: 'stockdata',
		debug: true,
	},
});

const createTables = async () => {
	// clears entire table
	// await knex('daily_data').truncate();

	// await knex.schema.dropTableIfExists('daily_data');
	// console.log('daily_data table deleted');
	// knex.schema.dropTableIfExists('symbol');
	// console.log('symbol table deleted');

	const symbolTblExists = await knex.schema.hasTable('symbol');

	if (!symbolTblExists) {
		try {
			await knex.schema.createTable('symbol', table => {
				// table.increments('id');
				// table.string('ticker', 10).notNullable();

				table.string('ticker', 10).notNullable().primary();

				// table.enu('stock_index', ['value1', 'value2']) //or: https://www.postgresql.org/docs/9.1/arrays.html
				// table.string('stock_index', 10);
				table.boolean('DJ30').defaultTo(false);
				table.boolean('NAS100').defaultTo(false);
				table.boolean('SP500').defaultTo(false);

				// table.time('created_at');
				// table.timestamp('created_at').defaultTo(knex.fn.now());
				// table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
				table.timestamps(true, true); //created_at and updated_at columns with default of now added
				// 		table.uuid('id').primary();
			});

			console.log('Created new symbol table');
		} catch (e) {
			console.log('error creating symbol table', e);
		}
	}

	const dailyDataTblExists = await knex.schema.hasTable('daily_data');

	if (!dailyDataTblExists) {
		try {
			await knex.schema.createTable('daily_data', table => {
				table.increments('id');

				// table.integer('stock_id').notNullable();
				table.string('stock_id', 10).notNullable();

				table.datetime('date_time').notNullable(); //2016-06-22 19:10:25-07 (ex precision)
				// table.timestamp('date_time'); //2016-06-22 19:10:25-07 (ex precision)
				// table.date('date_time');

				table.decimal('openPrice');
				table.decimal('highPrice');
				table.decimal('lowPrice');
				table.decimal('closePrice');
				table.bigInteger('totalVolume');

				table.decimal('sma');
				table.decimal('ema');

				table.timestamps(true, true); //created_at and updated_at columns with default of now added

				// table.foreign('stock_id').references('id').inTable('symbol');
				table.foreign('stock_id').references('ticker').inTable('symbol');

				table.unique(['stock_id', 'date_time']); //allow only one row per stock and datetime
			});

			console.log('Created new daily data table');
		} catch (e) {
			console.log('error creating daily data table', e);
		}
	}
};

const insertIntoTable = async data => {
	try {
		// await knex('daily_data').truncate(); //clear table
		// await knex('daily_data').insert(data);
		await knex('daily_data').insert(data).onConflict(['stock_id', 'date_time']).merge();

		// console.log('Successfully inserted daily data');
	} catch (error) {
		console.log(error, 'error');
	}
};

// const retrieveData = async () => {
// 	// const selection = await knex('daily_data').where('id', '>', '20');
// 	// const selection = await knex('daily_data')
// 	// 	.where('id', '>', '20')
// 	// 	.select('date_time', 'openPrice');
// 	// console.log(selection);

// 	const selection = await knex('daily_data')
// 		.where('stock_id', 'GOOGL')
// 		.andWhere('date_time', '>', '2015-01-20')
// 		.orderBy('date_time', 'desc')
// 		.limit(3)
// 		// .select('date_time', 'openPrice');
// 		.select('*');
// 	console.log(selection);
// };

const retrieveData = async (symbol, lookBack, parameters) => {
	try {
		// const selection = await knex('daily_data').where('id', '>', '20');
		// const selection = await knex('daily_data')
		// 	.where('id', '>', '20')
		// 	.select('date_time', 'openPrice');
		// console.log(selection);
		// AOS, ABT

		// const selection = await knex('daily_data')
		// 	.where('stock_id', symbol)
		// 	// .andWhere('date_time', '>', '2015-01-20')
		// 	.orderBy('date_time', 'desc')
		// 	.limit(lookBack)
		// 	// .select(parameter);
		// 	.select('date_time', 'closePrice');
		// // .orderBy('date_time', 'asc')
		// // .select('*');
		// // .whereIn('stock_id', ['MMM', 'AOS', 'ABT'])
		// // .select('*');

		const selection = await knex('daily_data')
			.where('stock_id', symbol)
			// .andWhere('date_time', '>', '2015-01-20')
			.orderBy('date_time', 'desc')
			.limit(lookBack)
			.select(...parameters);

		// .select('date_time', 'closePrice');

		// const selection = await knex('daily_data')
		// 	.orderBy('date_time', 'desc')
		// 	.limit(5)
		// 	// .select(parameter);
		// 	.select('*');

		// knex.select('*').from('users');
		// (1)
		// SELECT * FROM mytable ORDER BY record_date DESC LIMIT 5;
		// (2)
		// SELECT *
		// FROM (SELECT * FROM mytable ORDER BY record_date DESC LIMIT 5)
		// ORDER BY record_date ASC;
		// OR
		// WITH t AS (
		// 	SELECT * FROM mytable ORDER BY record_date DESC LIMIT 5
		// )
		// SELECT * FROM t ORDER BY record_date ASC;

		// 	knex.with('with_alias', knex.raw('select * from "books" where "author" = ?', 'Test')).select('*').from('with_alias')
		// Outputs:
		// with `with_alias` as (select * from "books" where "author" = 'Test') select * from `with_alias`

		// console.log(selection.reverse());

		return selection.reverse();
	} catch (e) {
		console.log('error retrieving data', e);
		return Promise.reject('could not retrieve data');
	}
};

const insertIntoTableSymbols = async stockUniverses => {
	// console.log(stockUniverses);

	const universes = Object.keys(stockUniverses);

	for (let i = 0; i < universes.length; i++) {
		const universe = universes[i];
		const stocks = stockUniverses[universe];
		// console.log(universe, stocks);
		const insertQuery = stocks.map(stock => ({ticker: stock, [universe]: true}));
		// console.log(insertQuery);
		try {
			await knex('symbol')
				.insert(insertQuery)
				.onConflict('ticker')
				.merge(['updated_at', universe]);

			console.log('Successfully inserted the data for', universe);
		} catch (error) {
			console.log(error, 'error');
		}
	}
};

// select count("closePrice") from "daily_data";
// knex('daily_data').select(knex.raw('count("closePrice")'));
// .then(data => console.log(data, 'data'));
//   .where(knex.raw(1))
//   .orWhere(knex.raw('status <> ?', [1]))
//   .groupBy('status')

// SELECT
//     date_trunc('month', date_time) m,
//     (array_agg("openPrice" ORDER BY date_time ASC))[1] o,
//     MAX("highPrice") h,
//     MIN("lowPrice") l,
//     (array_agg("closePrice" ORDER BY date_time DESC))[1] c,
//     SUM("totalVolume") totalVolume,
//     COUNT(*) ticks
// FROM "daily_data"
// WHERE
// 	"stock_id" = 'AOS' AND
// 	date_time BETWEEN '2010-01-01' AND '2011-01-01'
// GROUP BY m
// ORDER BY m
// LIMIT 100;

// knex('daily_data')
// 	.select(['date_time'])
// 	.where(knex.raw('date_time'), '>=', '2010-01-01')
// 	.andWhere(knex.raw('date_time'), '<=', '2011-01-01')
// 	// .groupByRaw("date_trunc('hour', date_time)")
// 	.then(data => console.log(data, 'data group'));

const retrieveSampledData = async (symbol, lookBack, parameters, samplePeriod) => {
	try {
		// .then(data => {
		// 	// const convData = data.map(item => {
		// 	// 	const dateObject = new Date(item.m);
		// 	// 	// const time = dateObject.toLocaleString('de-de').split(' ')[1]; //US time
		// 	// 	// console.log(dateObject.toLocaleString(), 'date');
		// 	// 	return {...item, m: new Date(item.m).toLocaleString()};
		// 	// });
		// 	// console.log(convData);

		// 	console.log(data, 'data');
		// 	console.log(data.reverse(), 'data reversed');
		// });

		// return selection.reverse();
		// return selection;

		// METHOD 1 --> RETURNS ALL USED COLUMNS
		// const selection = await knex
		// 	.select(
		// 		knex.raw(`date_trunc('${samplePeriod}', date_time) date_time_s,
		// 			(array_agg("openPrice" ORDER BY date_time ASC))[1] "openPrice",
		// 			MAX("highPrice") "highPrice",
		// 			MIN("lowPrice") "lowPrice",
		// 			(array_agg("closePrice" ORDER BY date_time DESC))[1] "closePrice",
		// 			SUM("totalVolume") "totalVolume",
		// 			count(*) ticks
		// 		`)
		// 	)
		// 	.from('daily_data')
		// 	.whereBetween('date_time', ['2000-01-01', '2020-01-01'])
		// 	.andWhere('stock_id', symbol)
		// 	.groupBy('date_time_s')
		// 	.orderBy('date_time_s', 'desc')
		// 	.limit(lookBack);
		// .then(data => console.log(data, 'data group'));
		// console.log(selection.reverse());

		// METHOD 2 --> RETURNS ONLY WHAT IS QUERIED
		const selection = await knex
			.with('with_alias', qb => {
				qb.select(
					knex.raw(`date_trunc('${samplePeriod}', date_time) date_time_s, 
				(array_agg("openPrice" ORDER BY date_time ASC))[1] "openPrice",
				MAX("highPrice") "highPrice", 
				MIN("lowPrice") "lowPrice",
				(array_agg("closePrice" ORDER BY date_time DESC))[1] "closePrice",
				SUM("totalVolume") "totalVolume",
				count(*) ticks
			`)
				)
					.from('daily_data')
					.where('stock_id', symbol)
					.groupBy('date_time_s')
					.orderBy('date_time_s', 'desc')
					.limit(lookBack);
			})
			.select(...parameters)
			// .select('date_time_s', 'closePrice')
			.from('with_alias');
		// .then(data => console.log(data, 'data group'));

		return selection.reverse();
	} catch (e) {
		console.log('error retrieving data', e);
		return Promise.reject('could not retrieve data');
	}
};

// retrieveData('AOS', 10, ['closePrice'])
// 	.then(data => console.log(data))
// 	.catch(e => console.log(e));

retrieveSampledData('AOS', 10, ['closePrice'], 'month')
	.then(data => console.log(data))
	.catch(e => console.log(e));

module.exports = {
	createTables,
	insertIntoTable,
	retrieveData,
	insertIntoTableSymbols,
};
