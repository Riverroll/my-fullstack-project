// backend/createTable.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ts1',
  password: '12345',
  port: 5432,
});

client.connect();

const createTableQuery = fs.readFileSync(path.join(__dirname, 'create_users_table.sql'), 'utf8');

client.query(createTableQuery)
  .then(res => {
    console.log('Table is successfully created');
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
