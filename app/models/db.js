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
const Select = (obj, cb) => {
	if (typeof obj !== 'object') return cb('first parameter is an object');

	const sql = `SELECT ${obj.columns} FROM ${obj.tables} WHERE ${obj.where}`;
	console.log(sql);
	conn.query(sql, (err, results, fields) => {
		if (err) throw err;
		return cb(err, results, fields);
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

// Insert obj{tables, columns, values}
const Insert = (obj, cb) => {
	if (typeof obj !== 'object') return cb('first parameter is an object');
	
	if (obj.columns.length != obj.values.length) {
		console.log('The number of columns must equal the number of values');
		return;
	}
	// add "'" to string
	obj.values.forEach((val, i) => {
		if (typeof val === 'string') {
			val = "'" + val + "'";
			obj.values[i] = val;
		}
	});
	const sql = `INSERT INTO ${obj.tables}(${obj.columns}) VALUES(${obj.values});`;
	conn.query(sql, (err, results, fields) => {
		return cb(err, results, fields);
	});
}

/*
columns = ['usrName', 'usrPwd', 'dplName'];
tables = ['users'];
values = ['darkworld', 123456, 'dArkWorlD'];
// Insert(columns, tables, values);
Delete(`users`, `usrName='darkworld'`);*/

module.exports.Select = Select;
module.exports.Insert = Insert;
module.exports.Delete = Delete;