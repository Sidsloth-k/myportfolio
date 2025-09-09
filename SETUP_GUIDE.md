# BSD Portfolio System - Complete Setup Guide

This guide will walk you through setting up the complete BSD Portfolio system, including the frontend portfolio, admin panel, and backend API.

## 🏗️ System Architecture

```
BSD Portfolio System
├── bsd-portfolio/          # Frontend portfolio website
├── bsd-admin-panel/        # Administrative interface
└── backend/                # REST API backend
```

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **PostgreSQL** 14.0 or higher
- **Git** for version control
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd sid
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your database credentials
nano .env
```

**Environment Configuration:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bsd_portfolio
DB_USER=your_username
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Frontend URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### 3. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE bsd_portfolio;
\q

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Start Backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will be available at: `http://localhost:5000`

## 🎨 Frontend Portfolio Setup

### 1. Navigate to Portfolio Directory

```bash
cd ../bsd-portfolio

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Create environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**Environment Variables:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_URL=http://localhost:3001
```

### 3. Start Portfolio

```bash
npm start
```

Portfolio will be available at: `http://localhost:3000`

## 🔐 Admin Panel Setup

### 1. Navigate to Admin Panel

```bash
cd ../bsd-admin-panel

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Create environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**Environment Variables:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_EMAIL=admin@example.com
REACT_APP_ADMIN_PASSWORD=secure_password
```

### 3. Start Admin Panel

```bash
# Start on port 3001 to avoid conflicts
npm run start:3001
```

Admin panel will be available at: `http://localhost:3001`

## 🗄️ Database Schema Overview

### Core Tables

```sql
-- Users and Authentication
users                    # Admin user accounts
audit_log               # Change tracking

-- Content Management
hero_content            # Hero section content
hero_quotes            # Hero section quotes
hero_cta_buttons       # Call-to-action buttons

about_content           # About section information

skill_categories        # Skill groupings
skills                  # Individual skills

project_categories      # Project groupings
projects                # Portfolio projects
project_images          # Project screenshots
project_testimonials    # Client feedback

characters              # Character profiles
character_quotes        # Character quotes

contact_submissions     # Contact form data

-- Media Management
media_files             # Uploaded files

-- Analytics
analytics_events        # User interaction tracking

-- Configuration
theme_settings          # Site customization
```

### Database Relationships

```
skill_categories (1) ←→ (many) skills
project_categories (1) ←→ (many) projects
projects (1) ←→ (many) project_images
projects (1) ←→ (many) project_testimonials
characters (1) ←→ (many) character_quotes
```

## 🔧 Development Workflow

### 1. Backend Development

```bash
cd backend

# Start with auto-reload
npm run dev

# Run tests
npm test

# Database operations
npm run db:migrate    # Apply schema changes
npm run db:seed       # Populate test data
```

### 2. Frontend Development

```bash
cd bsd-portfolio

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### 3. Admin Panel Development

```bash
cd bsd-admin-panel

# Start development server
npm start

# Build for production
npm run build
```

## 📱 Content Management

### 1. Access Admin Panel

- Navigate to: `http://localhost:3001`
- Login with admin credentials
- Use the sidebar to navigate between sections

### 2. Manage Content

#### Hero Section
- Edit main title and subtitle
- Add/remove quotes
- Configure CTA buttons
- Upload background images

#### Skills
- Create skill categories
- Add skills with proficiency levels
- Organize by technology type
- Set display order

#### Projects
- Create project entries
- Upload multiple images
- Add client testimonials
- Set project status and dates

#### Characters
- Manage character profiles
- Add character quotes
- Upload character images
- Set personality traits

#### Contact Management
- View form submissions
- Mark as read/unread
- Reply to inquiries
- Track submission status

### 3. Media Management

- Upload images and files
- Organize with tags
- Generate thumbnails
- Manage file metadata

## 🚀 Deployment

### 1. Production Environment

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend
cd ../bsd-portfolio
npm run build
# Deploy build/ folder to your hosting service

# Admin Panel
cd ../bsd-admin-panel
npm run build
# Deploy build/ folder to your hosting service
```

### 2. Environment Variables (Production)

```env
# Backend
NODE_ENV=production
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
JWT_SECRET=your_production_jwt_secret

# Frontend
REACT_APP_API_URL=https://api.yourdomain.com

# Admin Panel
REACT_APP_API_URL=https://api.yourdomain.com
```

### 3. Supabase Migration

```bash
# Update database connection
# Edit backend/src/database/config.js

# Run migrations
npm run db:migrate

# Verify data integrity
npm run db:seed
```

## 🔒 Security Considerations

### 1. Authentication

- Use strong JWT secrets
- Implement rate limiting
- Enable HTTPS in production
- Regular token rotation

### 2. Database Security

- Use environment variables for credentials
- Implement connection pooling
- Regular backup procedures
- Access control and permissions

### 3. API Security

- Input validation and sanitization
- CORS configuration
- Request size limits
- Error handling (no sensitive data exposure)

## 📊 Monitoring & Maintenance

### 1. Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Database connection
npm run db:test
```

### 2. Logs

```bash
# Backend logs
tail -f backend/logs/app.log

# Error monitoring
# Implement proper logging service
```

### 3. Performance

- Monitor database query performance
- Track API response times
- Optimize image sizes
- Implement caching strategies

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Verify credentials in .env
# Test connection manually
psql -h localhost -U your_username -d bsd_portfolio
```

#### 2. Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm start
```

#### 3. CORS Issues
```bash
# Check backend CORS configuration
# Verify frontend URLs in backend .env
# Clear browser cache
```

#### 4. Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Development Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - Database management
- [VS Code](https://code.visualstudio.com/) - Code editor
- [DBeaver](https://dbeaver.io/) - Universal database tool

## 🤝 Support

### Getting Help
1. Check the troubleshooting section above
2. Review error logs and console output
3. Search existing issues
4. Create a new issue with detailed information

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy Coding! 🚀**

This system provides a robust foundation for managing your portfolio content with a professional admin interface and scalable backend architecture. 