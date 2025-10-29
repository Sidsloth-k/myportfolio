# Database Setup for Admin Panel

## Steps to Set Up Admin User Database

### 1. Run the Migration

First, create the `admin_users` table in your database:

```bash
cd backend
npm run db:migrate
```

This will run all migrations including the new `012_create_admin_users.sql` migration.

### 2. Seed the Admin User

After running migrations, seed the default admin user:

```bash
npm run db:seed:admin
```

This will create an admin user with:
- **Username**: `admin`
- **Password**: `detective2024`
- **Full Name**: `Admin User`
- **Email**: `admin@bsdportfolio.com`

### 3. Verify Setup

The admin user should now be in your database. You can verify by connecting to your database and running:

```sql
SELECT id, username, full_name, email, role, is_active, created_at 
FROM admin_users;
```

## How It Works

1. **Login Flow**:
   - User enters username and password
   - Backend queries `admin_users` table
   - Password is verified using bcrypt
   - JWT token is generated with user info
   - User data is returned to frontend

2. **Token Verification**:
   - On app load, frontend verifies token
   - Backend checks token validity and fetches user from database
   - Ensures user still exists and is active

3. **Password Security**:
   - Passwords are hashed using bcrypt with salt rounds of 10
   - Never stored in plain text
   - Comparison is done securely

## Creating Additional Admin Users

To create more admin users, you can either:

1. **Use SQL directly**:
```sql
INSERT INTO admin_users (username, password_hash, full_name, email, role)
VALUES ('newadmin', '$2a$10$hashedpasswordhere', 'New Admin', 'email@example.com', 'admin');
```

2. **Update the seed file** and run it again (it checks for existing users)

3. **Create a user management API** (future feature)

## Notes

- The migration will only run if the table doesn't exist (uses `CREATE TABLE IF NOT EXISTS`)
- The seed will skip if admin user already exists
- You can run the migration multiple times safely
- You can run the seed multiple times safely (it checks for duplicates)

