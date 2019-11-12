const db = require('mysql');

const conn = db.createConnection({
	host	: 'localhost',
	user 	: 'root',
	password: '',
	database: 'chat',
	charset	: 'utf8mb4_unicode_ci'
});

conn.connect(err => {
	if (err) throw err;
	console.log('Connected!!!');
});

// Select
const Select = (columns, tables, where=1) => {
	const sql = `SELECT ${columns} FROM ${tables} WHERE ${where}`;
	console.log(sql);
	conn.query(sql, (err, results, fields) => {
		if (err) throw err;
		console.log(results);
		return results;
	});
}

// Delete
const Delete = (tables, where=1) => {
	const sql = `DELETE FROM ${tables} WHERE ${where};`;
	conn.query(sql, (err, results, fields) => {
		if (err) throw err;
		console.log(results);
		return results;
	});
}

// Insert
const Insert = (columns, tables, values) => {
	if (columns.length != values.length) {
		console.log('The number of lines must equal the number of values');
		return;
	}
	// add "'" for string
	values.forEach((val, i) => {
		if (typeof val === 'string') {
			val = "'" + val + "'";
			values[i] = val;
		}
	});
	const sql = `INSERT INTO ${tables}(${columns}) VALUES(${values});`;
	conn.query(sql, (err, results, fields) => {
		if (err) throw err;
		console.log(results);
		return results;
	});
}

columns = ['usrName', 'usrPwd', 'dplName'];
tables = ['users'];
values = ['darkworld', 123456, 'dArkWorlD'];
// Insert(columns, tables, values);
Delete(`users`, `usrName='darkworld'`);