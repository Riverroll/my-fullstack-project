const { Client } = require('pg');
const bcrypt = require('bcrypt'); // Add bcrypt for hashing passwords

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ts1',
  password: '1234',
  port: 5432,
});

client.connect();

const seedUsers = async () => {
  try {
    const hashedPasswordAlice = await bcrypt.hash('password123', 10);
    const hashedPasswordBob = await bcrypt.hash('password123', 10);
    const hashedPasswordCharlie = await bcrypt.hash('password123', 10);

    const seedQuery = `
      INSERT INTO users (name, email, password) VALUES
      ('Alice', 'alice@example.com', $1),
      ('Bob', 'bob@example.com', $2),
      ('Charlie', 'charlie@example.com', $3)
      ON CONFLICT (email) DO NOTHING;
    `;

    await client.query(seedQuery, [hashedPasswordAlice, hashedPasswordBob, hashedPasswordCharlie]);

    console.log('Users are successfully seeded');
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
};

seedUsers();
