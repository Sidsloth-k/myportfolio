# Portfolio Backend API

This is the backend API for the portfolio content management system. It provides RESTful endpoints for managing all portfolio content including hero sections, about information, skills, projects, contact details, and character systems.

## Features

- **Content Management APIs** for all portfolio sections
- **RESTful endpoints** following best practices
- **Rate limiting** and security middleware
- **CORS support** for frontend integration
- **Error handling** and validation
- **Modular route structure** for easy maintenance

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Content Management
- `GET/PUT /api/hero` - Hero section content
- `GET/PUT /api/about` - About section content
- `GET/PUT /api/skills` - Skills section content
- `GET/PUT /api/projects` - Projects section content
- `GET/PUT /api/contact` - Contact section content
- `GET/PUT /api/characters` - Character system content

### Media & Analytics
- `GET /api/media` - Media files management
- `GET /api/analytics` - Analytics data

### Health Check
- `GET /api/health` - API health status

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── models/          # Data models and mock data
│   └── index.js         # Main server file
├── package.json
└── README.md
```

## Content Models

The backend uses structured content models for each portfolio section:

- **Hero Content**: Title, subtitle, description, quotes, CTA buttons
- **About Content**: Personal info, timeline, characteristics
- **Skills Content**: Categories and individual skills with levels
- **Projects Content**: Project details, technologies, stats
- **Contact Content**: Contact info, form fields, case types
- **Character Content**: Character quotes, icons, animations

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- JWT authentication with refresh tokens
- File upload and image processing
- Content versioning and history
- Real-time updates via WebSocket
- Advanced analytics and reporting
- Content backup and restore

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Development Notes

- Currently uses mock data for development
- All endpoints are functional and ready for frontend integration
- CORS is configured for localhost:3000 (frontend)
- Rate limiting is set to 100 requests per 15 minutes
- Health check endpoint available at `/api/health`

## Testing

```bash
npm test
```

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation for new endpoints
5. Test all endpoints before committing 