# Admin Panel Database Setup - Quick Start

## Setup Steps

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Run migrations** (creates admin_users table):
   ```bash
   npm run db:migrate
   ```

3. **Seed admin user** (creates default admin account):
   ```bash
   npm run db:seed:admin
   ```

4. **Start backend server**:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Start admin panel** (in a new terminal):
   ```bash
   cd admin
   npm install  # if not done already
   npm start
   ```

## Default Credentials

- **Username**: `admin`
- **Password**: `detective2024`

## What Was Created

### Database
- ✅ `admin_users` table with migrations
- ✅ Default admin user seed script
- ✅ Password hashing with bcrypt

### Backend Changes
- ✅ Auth routes now query database instead of hardcoded credentials
- ✅ Password verification using bcrypt
- ✅ User data fetched from database on login and verification
- ✅ Last login tracking

### Frontend Changes
- ✅ Dashboard shows simple "Welcome [User Name]" message
- ✅ User data includes full_name, email, and other fields from database
- ✅ Updated User interface to match database schema

## How It Works

1. **Login**: 
   - User enters credentials → Backend queries `admin_users` table
   - Password verified with bcrypt → JWT token generated
   - User data (including full_name) returned to frontend

2. **Dashboard**:
   - Displays "Dashboard" title
   - Shows "Welcome [full_name or username]"
   - Simple, clean blank page as requested

3. **Token Verification**:
   - On page load, backend verifies token
   - Fetches fresh user data from database
   - Ensures user still exists and is active

## Files Created/Modified

### New Files:
- `backend/src/database/migrations/012_create_admin_users.sql`
- `backend/src/database/seeds/seed_admin_user.js`
- `backend/ADMIN_SETUP.md`

### Modified Files:
- `backend/src/routes/auth.js` - Now uses database
- `admin/src/contexts/AuthContext.tsx` - Updated User interface
- `admin/src/components/Dashboard.tsx` - Simple welcome page
- `admin/src/components/Dashboard.css` - Simplified styling
- `backend/package.json` - Added seed:admin script

## Next Steps

You can now:
- Log in with the admin credentials
- See the welcome message with user's name
- Add more admin users to the database as needed
- Expand the dashboard with additional features

The admin panel is now fully connected to the backend database!

