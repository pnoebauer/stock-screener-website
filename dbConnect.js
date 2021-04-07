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

const createTable = () => {
	// knex.schema.dropTableIfExists('daily_data').then(d => console.log('daily_data'));
	// knex.schema.dropTableIfExists('symbol').then(d => console.log('symbol'));

	knex.schema.hasTable('symbol').then(exists => {
		// console.log(exists, 'ex');
		if (!exists) {
			return knex.schema
				.createTable('symbol', table => {
					// table.increments('id');
					// table.string('ticker', 10).notNullable();

					table.string('ticker', 10).notNullable().primary();

					// table.enu('stock_index', ['value1', 'value2']) //or: https://www.postgresql.org/docs/9.1/arrays.html
					table.string('stock_index', 10);
					// table.time('created_at');
					// table.timestamp('created_at').defaultTo(knex.fn.now());
					// table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
					table.timestamps(true, true); //created_at and updated_at columns with default of now added
					// 		table.uuid('id').primary();
				})
				.then(d => console.log(d, 'created symbol'))
				.catch(e => console.log(e, 'error symbol'));
		}
	});

	knex.schema.hasTable('daily_data').then(exists => {
		// console.log(exists, 'ex');
		if (!exists) {
			return knex.schema
				.createTable('daily_data', table => {
					table.increments('id');

					// table.integer('stock_id').notNullable();
					table.string('stock_id', 10).notNullable();

					// table.timestamp('datetime', {precision: 6}); 2016-06-22 19:10:25-07 (ex precision)
					table.date('datetime');

					table.decimal('open_price');
					table.decimal('high_price');
					table.decimal('low_price');
					table.decimal('close_price');
					table.bigInteger('volume');
					table.timestamps(true, true); //created_at and updated_at columns with default of now added

					// table.foreign('stock_id').references('id').inTable('symbol');
					table.foreign('stock_id').references('ticker').inTable('symbol');
				})
				.then(d => console.log(d, 'created daily_data'))
				.catch(e => console.log(e, 'error daily_data'));
		}
	});
};

const insertIntoTable = () => {
	knex('daily_data')
		.insert([
			{stock_id: 'AAPL', datetime: '2020-01-01', open_price: 10, volume: 100},
			{stock_id: 'AAPL', datetime: '2020-01-02', open_price: 20, volume: 200},
			{stock_id: 'AAPL', datetime: '2020-01-03', open_price: 30, volume: 50},
			{
				stock_id: 'AAPL',
				datetime: '2020-01-04',
				open_price: 30,
				volume: 50,
				created_at: '2020-01-04 13:05:05',
			},
		])
		// .into('daily_data');
		.then(s => console.log('success'))
		.catch(e => console.log(e, 'error'));
};

module.exports = {createTable, insertIntoTable};
