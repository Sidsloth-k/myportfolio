const bcrypt = require('bcryptjs');
const pool = require('../config');

async function seedAdminUser() {
  try {
    const username = 'admin';
    const password = 'detective2024';
    const fullName = 'Admin User';
    const email = 'admin@bsdportfolio.com';
    
    // Check if admin user already exists
    const existingUser = await pool.query(
      'SELECT id FROM admin_users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists, skipping seed...');
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO admin_users (username, password_hash, full_name, email, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, full_name, email, role`,
      [username, passwordHash, fullName, email, 'admin']
    );

    console.log('Admin user seeded successfully:', result.rows[0]);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedAdminUser();
    console.log('Admin user seed completed');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedAdminUser };



