# BSD Portfolio Admin Panel

Admin panel for managing the BSD Portfolio website. Built with React, TypeScript, and connected to the backend API with JWT authentication and session management.

## Features

- **Secure Authentication**: JWT token-based authentication with secure cookies
- **Session Management**: Automatic token verification and session handling
- **Rate Limiting**: Protection against brute force attacks
- **Animated UI**: Beautiful animated login form inspired by modern designs
- **BSD Portfolio Theming**: Consistent color scheme with the main portfolio

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

The admin panel will be available at `http://localhost:3002` (or the next available port).

## Backend Setup

### Install Backend Dependencies

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install cookie-parser:
```bash
npm install cookie-parser
```

3. The backend should already have:
   - `jsonwebtoken` for JWT tokens
   - `bcryptjs` for password hashing
   - `express-rate-limit` for rate limiting
   - Auth routes at `/api/auth`

### Environment Variables

Add to your backend `.env`:
```
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Default Credentials

- **Username**: `admin`
- **Password**: `detective2024`

**⚠️ Change these credentials in production!**

## Project Structure

```
admin/
├── src/
│   ├── components/        # React components
│   │   ├── LoginForm.tsx  # Animated login form
│   │   ├── LoginForm.css  # Login form styles
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   └── Dashboard.css  # Dashboard styles
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── services/         # API services
│   │   └── api.ts        # API service layer
│   ├── styles/           # Global styles
│   │   └── globals.css   # Global CSS
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── public/               # Static files
├── package.json          # Dependencies
└── README.md            # This file
```

## Security Features

1. **JWT Tokens**: Secure token-based authentication
2. **HttpOnly Cookies**: Tokens stored in secure, httpOnly cookies
3. **Rate Limiting**: Login attempts limited to 5 per 15 minutes
4. **CORS Protection**: Configured CORS with credentials
5. **Session Validation**: Automatic token verification on page load

## API Endpoints

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify authentication token

## Development

### Adding New Features

Features will be added incrementally. The admin panel is designed to be expanded feature by feature.

### Styling

The admin panel uses:
- Custom CSS for the login form (inspired by Day9 design)
- BSD Portfolio color scheme for the dashboard
- Tailwind CSS for utility classes (if needed)

## Production Deployment

1. Build the production bundle:
```bash
npm run build
```

2. The `build` folder contains static files ready for deployment

3. Configure your web server to:
   - Serve the build folder
   - Proxy API requests to the backend
   - Set secure cookie flags in production

## Troubleshooting

### Cannot connect to backend

- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify `.env` has correct API URL

### Authentication fails

- Check JWT_SECRET in backend `.env`
- Verify cookies are enabled in browser
- Check browser console for errors

### Login form not animating

- Ensure Boxicons CDN is loaded (check `public/index.html`)
- Check browser console for CSS errors

## Next Steps

The admin panel is set up with authentication. Future features to be added:
- Projects management
- Skills management
- Contact messages viewer
- Media file uploader
- Analytics dashboard

## License

MIT

