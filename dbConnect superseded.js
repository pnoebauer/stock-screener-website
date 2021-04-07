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

// CREATE TABLE symbol (
// 	id SERIAL PRIMARY KEY,
// 	exchange_id integer NULL,
// 	ticker TEXT NOT NULL,
// 	instrument TEXT NOT NULL,
// 	name TEXT NOT NULL,
// 	sector TEXT NOT NULL,
// 	currency VARCHAR(64) NULL,
// 	created_date TIMESTAMP NOT NULL,
// 	last_updated_date TIMESTAMP NOT NULL,
// 	FOREIGN KEY (exchange_id) REFERENCES exchange(id)
// 	)

const createTable = () => {
	// knex.schema.dropTableIfExists('daily_data').then(d => console.log('daily_data'));
	// knex.schema.dropTableIfExists('symbol').then(d => console.log('symbol'));

	knex.schema.hasTable('symbol').then(exists => {
		// console.log(exists, 'ex');
		if (!exists) {
			return knex.schema
				.createTable('symbol', table => {
					table.increments('id');
					table.string('ticker', 10).notNullable();
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

	// CREATE TABLE daily_data (
	// 	id SERIAL PRIMARY KEY,
	// 	data_vendor_id INTEGER NOT NULL,
	// 	stock_id INTEGER NOT NULL,
	// 	created_date TIMESTAMP NOT NULL,
	// 	last_updated_date TIMESTAMP NOT NULL,
	// 	date_price DATE,
	// 	open_price NUMERIC,
	// 	high_price NUMERIC,
	// 	low_price NUMERIC,
	// 	close_price NUMERIC,
	// 	adj_close_price NUMERIC,
	// 	volume BIGINT,
	// 	FOREIGN KEY (data_vendor_id) REFERENCES data_vendor(id),
	// 	FOREIGN KEY (stock_id) REFERENCES symbol(id)
	// 	)

	// knex.schema.dropTableIfExists('daily_data').then(d => console.log('daily_data'));
	// knex.schema.dropTableIfExists('symbol').then(d => console.log('symbol'));

	knex.schema.hasTable('daily_data').then(exists => {
		// console.log(exists, 'ex');
		if (!exists) {
			return knex.schema
				.createTable('daily_data', table => {
					table.increments('id');
					table.integer('stock_id').notNullable();
					// table.timestamp('datetime', {precision: 6});
					table.date('datetime');
					// table.decimal('open', { precision: 10 }, {scale: 5}) //precision: digits before comma, scale: digits after comma
					table.decimal('open_price');
					table.decimal('high_price');
					table.decimal('low_price');
					table.decimal('close_price');
					table.bigInteger('volume');
					table.timestamps(true, true); //created_at and updated_at columns with default of now added

					table.foreign('stock_id').references('id').inTable('symbol');
				})
				.then(d => console.log(d, 'created daily_data'))
				.catch(e => console.log(e, 'error daily_data'));
		}
	});
};

module.exports = {createTable};
