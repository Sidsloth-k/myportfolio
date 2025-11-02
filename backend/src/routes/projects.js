// This file has been refactored into modular routes
// See: backend/src/routes/projects/index.js and backend/src/routes/projects/handlers/ for the new structure
// The old monolithic file was 880 lines and has been split into:
//   - backend/src/services/projects/ProjectQueries.js (SQL queries)
//   - backend/src/services/projects/ProjectService.js (business logic)
//   - backend/src/services/projects/ProjectCreateService.js (create operations)
//   - backend/src/services/projects/ProjectUpdateService.js (update operations)
//   - backend/src/routes/projects/handlers/* (route handlers)
//   - backend/src/routes/projects/index.js (route definitions)

// Redirect to the new modular structure
module.exports = require('./projects/index');
