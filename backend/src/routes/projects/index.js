const express = require('express');
const router = express.Router();

// Import route handlers
const { getAllProjects, getProjectById } = require('./handlers/getProjects');
const { createProject } = require('./handlers/createProject');
const { updateProject } = require('./handlers/updateProject');
const { patchProject } = require('./handlers/patchProject');
const { deleteProject } = require('./handlers/deleteProject');
const { getCategories, createCategory, getTypes } = require('./handlers/categoryRoutes');

// GET Routes
router.get('/', getAllProjects);
router.get('/categories', getCategories);
router.get('/types', getTypes);
router.get('/:id', getProjectById);

// POST Routes
router.post('/', createProject);
router.post('/categories', createCategory);

// PUT Routes
router.put('/:id', updateProject);

// PATCH Routes
router.patch('/:id', patchProject);

// DELETE Routes
router.delete('/:id', deleteProject);

module.exports = router;

