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
	// console.log('daily_data table created');
	// knex.schema.dropTableIfExists('symbol');
	// console.log('symbol table created');

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

				table.decimal('open_price');
				table.decimal('high_price');
				table.decimal('low_price');
				table.decimal('close_price');
				table.bigInteger('volume');

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
// 	// 	.select('date_time', 'open_price');
// 	// console.log(selection);

// 	const selection = await knex('daily_data')
// 		.where('stock_id', 'GOOGL')
// 		.andWhere('date_time', '>', '2015-01-20')
// 		.orderBy('date_time', 'desc')
// 		.limit(3)
// 		// .select('date_time', 'open_price');
// 		.select('*');
// 	console.log(selection);
// };

const retrieveData = async (symbol, lookBack, parameter) => {
	// const selection = await knex('daily_data').where('id', '>', '20');
	// const selection = await knex('daily_data')
	// 	.where('id', '>', '20')
	// 	.select('date_time', 'open_price');
	// console.log(selection);
	// AOS, ABT

	const selection = await knex('daily_data')
		.where('stock_id', symbol)
		// .andWhere('date_time', '>', '2015-01-20')
		.orderBy('date_time', 'desc')
		.limit(lookBack)
		// .select(parameter);
		.select('date_time', 'close_price');
	// .orderBy('date_time', 'asc')
	// .select('*');
	// .whereIn('stock_id', ['MMM', 'AOS', 'ABT'])
	// .select('*');

	// const selection = await knex('daily_data')
	// 	.where('stock_id', symbol)
	// 	// .andWhere('date_time', '>', '2015-01-20')
	// 	.orderBy('date_time', 'desc')
	// 	.limit(lookBack)
	// 	// .select(parameter);
	// 	.select('date_time', 'close_price');

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
};

const ins = () => {
	knex('sometable2')
		.insert({
			col1: 3,
			col2: 3,
			col3: 300,
		})
		.onConflict(['col1', 'col2'])
		.merge()
		.then(e => console.log('success'))
		.catch(e => console.log('error', e));
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

module.exports = {
	createTables,
	insertIntoTable,
	retrieveData,
	ins,
	insertIntoTableSymbols,
};
