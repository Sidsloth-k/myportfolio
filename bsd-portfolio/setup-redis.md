# Redis Cloud Setup Guide

## Quick Setup

1. **Create environment files:**
   ```bash
   # Frontend (from bsd-portfolio directory)
   cp env.example .env
   
   # Backend (from backend directory)
   cp env.example .env
   ```

2. **Verify the .env files contain the Redis Cloud credentials:**
   - Frontend: `bsd-portfolio/.env`
   - Backend: `backend/.env`

3. **Install dependencies:**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

4. **Start the applications:**
   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from bsd-portfolio directory)
   npm start
   ```

## Redis Cloud Configuration

Your Redis Cloud instance is configured with:
- **Host**: 
- **Port**: 
- **Username**: 
- **Password**: 

## Environment Variables

The following environment variables are already configured in the `.env.example` files:

### Frontend (.env)
```env
REACT_APP_REDIS_HOST=
REACT_APP_REDIS_PORT=
REACT_APP_REDIS_USERNAME=
REACT_APP_REDIS_PASSWORD=
REACT_APP_REDIS_DB=
REACT_APP_API_BASE_URL=http://localhost:3001
```

### Backend (.env)
```env
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_DB=0
```

## Testing the Cache System

1. **Start both applications**
2. **Open browser console** to see cache logs
3. **Navigate between pages** to see cache hits
4. **Check Redis Cloud dashboard** to see cached data

## Cache Keys Format

The system uses these Redis key patterns:
- `portfolio:projects` - All projects
- `portfolio:project:{id}` - Specific project details
- `portfolio:skills` - All skills
- `portfolio:skill_categories` - Skill categories
- `portfolio:session` - Session data
- `portfolio:cache_version` - Cache version

## Troubleshooting

### Connection Issues
- Verify Redis Cloud instance is running
- Check network connectivity
- Ensure credentials are correct

### Cache Not Working
- Check browser console for errors
- Verify environment variables are loaded
- Test Redis connection with the test script

### Performance Issues
- Monitor Redis Cloud dashboard
- Check cache hit rates in browser console
- Verify TTL settings are appropriate
