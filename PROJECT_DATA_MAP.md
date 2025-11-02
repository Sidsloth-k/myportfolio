# Project Database Schema & Data Flow Map

## Overview
This document maps out the complete project data structure, required/optional fields, relationships, and data flow for the admin projects page.

---

## Database Tables & Relationships

### 1. PROJECTS Table (Core)
**Table:** `projects`
**Primary Key:** `id` (BIGSERIAL)
**Foreign Keys:** None (root table)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | BIGSERIAL | Auto | Primary key, auto-generated |
| `title` | TEXT | ✅ **REQUIRED** | Project title |
| `category` | TEXT | ✅ **REQUIRED** | Project category (e.g., "Data Science", "Health & Wellness") |
| `type` | TEXT | ✅ **REQUIRED** | Project type (e.g., "SaaS Platform", "Mobile Application") |
| `description` | TEXT | ✅ **REQUIRED** | Short description |
| `subtitle` | TEXT | Optional | Subtitle/tagline |
| `long_description` | TEXT | Optional | Detailed description |
| `timeline` | TEXT | Optional | Project timeline (e.g., "10 months") |
| `team` | TEXT | Optional | Team composition (e.g., "6 developers, 2 data scientists") |
| `role` | TEXT | Optional | Role in project (e.g., "Lead Backend Developer") |
| `budget` | TEXT | Optional | Budget information (e.g., "$3.0M") |
| `client` | TEXT | Optional | Client name |
| `cover_image_url` | TEXT | Optional | Main cover image URL |
| `highlight` | TEXT | Optional | Highlight badge text |
| `is_active` | BOOLEAN | Auto (default: TRUE) | Soft delete flag |
| `created_at` | TIMESTAMPTZ | Auto | Auto-generated timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Auto-updated timestamp |

**Form Fields:**
- Input: title (text)
- Dropdown: category (from API: GET /api/projects/categories)
- Dropdown: type (predefined: "SaaS Platform", "Web Application", "Mobile Application", etc.)
- Textarea: description (required)
- Input: subtitle (optional)
- Textarea: long_description (optional)
- Input: timeline (optional)
- Input: team (optional)
- Input: role (optional)
- Input: budget (optional)
- Input: client (optional)
- Input: cover_image_url (optional, with image upload support)
- Input: highlight (optional)

---

### 2. PROJECT_LINKS Table
**Table:** `project_links`
**Primary Key:** `project_id` (references projects.id)
**Foreign Keys:** `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `live` | TEXT | Optional | Live site URL |
| `github` | TEXT | Optional | GitHub repository URL |
| `documentation` | TEXT | Optional | Documentation URL |
| `case_study` | TEXT | Optional | Case study URL |
| `demo` | TEXT | Optional | Demo URL |

**Form Fields:**
- Input: live (optional, URL)
- Input: github (optional, URL)
- Input: documentation (optional, URL)
- Input: case_study (optional, URL)
- Input: demo (optional, URL)

---

### 3. PROJECT_TECHNOLOGIES Table (Technologies/Skills)
**Table:** `project_technologies`
**Primary Key:** Composite (project_id, skill_id)
**Foreign Keys:** 
- `project_id` → `projects.id` (ON DELETE CASCADE)
- `skill_id` → `skills.id` (ON DELETE RESTRICT)

**Note:** After migration 010, this uses `skill_id` instead of `technology_id`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `skill_id` | BIGINT | ✅ **REQUIRED** | FK to skills.id |
| `level` | TEXT | Optional | Proficiency level (e.g., "90", "Advanced", "Master") |

**Form Fields:**
- Multi-select dropdown: technologies (from API: GET /api/skills)
- Each selected skill can have:
  - Input: level (optional text input)

**Data Structure:**
```json
{
  "technologies": [
    {
      "skill_id": 1,
      "name": "React",
      "level": "90"
    },
    {
      "skill_id": 2,
      "name": "Node.js",
      "level": "85"
    }
  ]
}
```

**API Endpoint:** GET /api/skills (returns skills with id, name, category)

---

### 4. PROJECT_IMAGES Table
**Table:** `project_images`
**Primary Key:** `id` (BIGSERIAL)
**Foreign Keys:** `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | BIGSERIAL | Auto | Primary key |
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `url` | TEXT | ✅ **REQUIRED** | Image URL |
| `caption` | TEXT | ✅ **REQUIRED** | Image caption |
| `type` | TEXT | ✅ **REQUIRED** | Image type (e.g., "screenshot", "mobile", "design") |
| `order` | INT | Optional (default: 0) | Display order |

**Form Fields:**
- Array of objects:
  - Input: url (required)
  - Input: caption (required)
  - Dropdown: type (required: "screenshot", "mobile", "design", "other")
  - Input: order (number, optional, default: 0)

**Data Structure:**
```json
{
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "caption": "Main Dashboard",
      "type": "screenshot",
      "order": 1
    }
  ]
}
```

---

### 5. PROJECT_FEATURES Table
**Table:** `project_features`
**Primary Key:** `id` (BIGSERIAL)
**Foreign Keys:** `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | BIGSERIAL | Auto | Primary key |
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `title` | TEXT | ✅ **REQUIRED** | Feature title |
| `description` | TEXT | ✅ **REQUIRED** | Feature description |
| `icon_key` | TEXT | Optional | Icon identifier (e.g., "activity", "users") |
| `status` | TEXT | ✅ **REQUIRED** | Status (e.g., "completed", "in progress", "planned") |
| `impact` | TEXT | Optional | Impact description |
| `order` | INT | Optional (default: 0) | Display order |

**Form Fields:**
- Array of objects:
  - Input: title (required)
  - Textarea: description (required)
  - Input: icon_key (optional)
  - Dropdown: status (required: "completed", "in progress", "planned")
  - Input: impact (optional)
  - Input: order (number, optional, default: 0)

**Data Structure:**
```json
{
  "features": [
    {
      "title": "Real-time Monitoring",
      "description": "Track metrics in real-time",
      "icon_key": "activity",
      "status": "completed",
      "impact": "20% faster reaction time",
      "order": 1
    }
  ]
}
```

---

### 6. PROJECT_ROADMAP_PHASES Table
**Table:** `project_roadmap_phases`
**Primary Key:** `id` (BIGSERIAL)
**Foreign Keys:** `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | BIGSERIAL | Auto | Primary key |
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `phase` | TEXT | ✅ **REQUIRED** | Phase name |
| `description` | TEXT | ✅ **REQUIRED** | Phase description |
| `duration` | TEXT | ✅ **REQUIRED** | Duration (e.g., "8 weeks") |
| `status` | TEXT | ✅ **REQUIRED** | Status (e.g., "completed", "in progress", "not started") |
| `deliverables` | TEXT[] | Optional | Array of deliverables |
| `challenges` | TEXT[] | Optional | Array of challenges |
| `solutions` | TEXT[] | Optional | Array of solutions |
| `order` | INT | Optional (default: 0) | Display order |

**Form Fields:**
- Array of objects:
  - Input: phase (required)
  - Textarea: description (required)
  - Input: duration (required)
  - Dropdown: status (required: "completed", "in progress", "not started")
  - Array input: deliverables (optional, multiple strings)
  - Array input: challenges (optional, multiple strings)
  - Array input: solutions (optional, multiple strings)
  - Input: order (number, optional, default: 0)

**Data Structure:**
```json
{
  "roadmap": [
    {
      "phase": "Discovery & Planning",
      "description": "Market research and architecture",
      "duration": "8 weeks",
      "status": "completed",
      "deliverables": ["User personas", "Architecture"],
      "challenges": ["Complex requirements"],
      "solutions": ["Microservices"],
      "order": 1
    }
  ]
}
```

---

### 7. PROJECT_STATS Table
**Table:** `project_stats`
**Primary Key:** `id` (BIGSERIAL)
**Foreign Keys:** `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | BIGSERIAL | Auto | Primary key |
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `key` | TEXT | ✅ **REQUIRED** | Stat key/label |
| `value` | TEXT | ✅ **REQUIRED** | Stat value |
| `is_list_stat` | BOOLEAN | Optional (default: FALSE) | Flag for list display |
| `order` | INT | Optional (default: 0) | Display order |

**Form Fields:**
- Array of objects:
  - Input: key (required)
  - Input: value (required)
  - Checkbox: is_list_stat (optional, default: false)
  - Input: order (number, optional, default: 0)

**Data Structure:**
```json
{
  "stats": [
    {
      "key": "Active Users",
      "value": "10K+",
      "is_list_stat": true,
      "order": 1
    }
  ]
}
```

---

### 8. PROJECT_METRICS Table
**Table:** `project_metrics`
**Primary Key:** `id` (BIGSERIAL)
**Foreign Keys:** `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | BIGSERIAL | Auto | Primary key |
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `key` | TEXT | ✅ **REQUIRED** | Metric key/label |
| `value` | TEXT | ✅ **REQUIRED** | Metric value |
| `order` | INT | Optional (default: 0) | Display order |

**Form Fields:**
- Array of objects:
  - Input: key (required)
  - Input: value (required)
  - Input: order (number, optional, default: 0)

**Data Structure:**
```json
{
  "metrics": [
    {
      "key": "Conversion Rate",
      "value": "+25%",
      "order": 1
    }
  ]
}
```

---

### 9. PROJECT_TESTIMONIALS Table
**Table:** `project_testimonials`
**Primary Key:** `id` (BIGSERIAL)
**Foreign Keys:** `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | BIGSERIAL | Auto | Primary key |
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `name` | TEXT | ✅ **REQUIRED** | Testimonial author name |
| `role` | TEXT | ✅ **REQUIRED** | Author role |
| `company` | TEXT | ✅ **REQUIRED** | Company name |
| `quote` | TEXT | ✅ **REQUIRED** | Testimonial quote |
| `rating` | INT | ✅ **REQUIRED** | Rating (1-5) |
| `order` | INT | Optional (default: 0) | Display order |

**Form Fields:**
- Array of objects:
  - Input: name (required)
  - Input: role (required)
  - Input: company (required)
  - Textarea: quote (required)
  - Number input: rating (required, min: 1, max: 5)
  - Input: order (number, optional, default: 0)

**Data Structure:**
```json
{
  "testimonials": [
    {
      "name": "Jane Doe",
      "role": "CEO",
      "company": "Example Corp",
      "quote": "Great project!",
      "rating": 5,
      "order": 1
    }
  ]
}
```

---

### 10. SKILL_PROJECTS Table (Skills Related to Project)
**Table:** `skill_projects`
**Primary Key:** Composite (skill_id, project_id)
**Foreign Keys:** 
- `skill_id` → `skills.id` (ON DELETE CASCADE)
- `project_id` → `projects.id` (ON DELETE CASCADE)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `skill_id` | BIGINT | ✅ **REQUIRED** | FK to skills.id |
| `project_id` | BIGINT | ✅ **REQUIRED** | FK to projects.id |
| `contribution` | TEXT | Optional | How skill contributed |
| `complexity` | TEXT | Optional | Complexity level |

**Form Fields:**
- Multi-select dropdown: skills (from API: GET /api/skills)
- For each selected skill:
  - Input: contribution (optional)
  - Input: complexity (optional)

**Note:** This is SEPARATE from project_technologies. Both can reference the same skills table, but:
- `project_technologies` links skills as technologies used (with level)
- `skill_projects` links skills with contribution/complexity info

**Data Structure:**
```json
{
  "skills": [
    {
      "skill_id": 1,
      "name": "React",
      "contribution": "Built frontend UI",
      "complexity": "high"
    }
  ]
}
```

---

## Data Flow & API Endpoints

### Required API Endpoints (Frontend → Backend):

1. **GET /api/skills** - Fetch all skills for dropdowns
   - Returns: Skills organized by categories
   - Used for: Technologies dropdown, Skills dropdown

2. **GET /api/projects/categories** - Fetch project categories
   - Returns: List of categories with counts
   - Used for: Category dropdown

3. **POST /api/projects** - Create project (needs enhancement)
   - Current: Only accepts basic fields
   - Needs: Accept full project data with all relationships

4. **PUT /api/projects/:id** - Update project (needs enhancement)
   - Current: Only updates projects table
   - Needs: Update all related tables

### Enhanced POST/PUT Payload Structure:

```json
{
  // Core project fields
  "title": "Project Name",
  "category": "Data Science",
  "type": "SaaS Platform",
  "description": "Short description",
  "subtitle": "Optional subtitle",
  "long_description": "Detailed description",
  "timeline": "10 months",
  "team": "6 developers",
  "role": "Lead Developer",
  "budget": "$3.0M",
  "client": "Client Name",
  "cover_image_url": "https://example.com/cover.jpg",
  "highlight": "Primary Focus",
  
  // Links
  "links": {
    "live": "https://example.com",
    "github": "https://github.com/...",
    "documentation": "https://docs.example.com",
    "case_study": "https://case-study.example.com",
    "demo": "https://demo.example.com"
  },
  
  // Technologies (using skill_id)
  "technologies": [
    {
      "skill_id": 1,
      "level": "90"
    }
  ],
  
  // Images
  "images": [
    {
      "url": "https://example.com/img1.jpg",
      "caption": "Main Dashboard",
      "type": "screenshot",
      "order": 1
    }
  ],
  
  // Features
  "features": [
    {
      "title": "Feature Title",
      "description": "Feature description",
      "icon_key": "activity",
      "status": "completed",
      "impact": "20% improvement",
      "order": 1
    }
  ],
  
  // Roadmap phases
  "roadmap": [
    {
      "phase": "Phase Name",
      "description": "Phase description",
      "duration": "8 weeks",
      "status": "completed",
      "deliverables": ["Item 1", "Item 2"],
      "challenges": ["Challenge 1"],
      "solutions": ["Solution 1"],
      "order": 1
    }
  ],
  
  // Stats
  "stats": [
    {
      "key": "Active Users",
      "value": "10K+",
      "is_list_stat": true,
      "order": 1
    }
  ],
  
  // Metrics
  "metrics": [
    {
      "key": "Conversion Rate",
      "value": "+25%",
      "order": 1
    }
  ],
  
  // Testimonials
  "testimonials": [
    {
      "name": "Jane Doe",
      "role": "CEO",
      "company": "Example Corp",
      "quote": "Great project!",
      "rating": 5,
      "order": 1
    }
  ],
  
  // Skills (different from technologies)
  "skills": [
    {
      "skill_id": 1,
      "contribution": "Built frontend",
      "complexity": "high"
    }
  ]
}
```

---

## Form Structure & UI Components

### Main Form Sections:

1. **Basic Information** (Required fields at top)
2. **Additional Details** (Optional basic fields)
3. **Links** (All optional URLs)
4. **Technologies** (Multi-select with level)
5. **Skills** (Multi-select with contribution/complexity)
6. **Images** (Dynamic array with upload support)
7. **Features** (Dynamic array)
8. **Roadmap Phases** (Dynamic array with sub-arrays)
9. **Stats** (Dynamic array)
10. **Metrics** (Dynamic array)
11. **Testimonials** (Dynamic array)

---

## Implementation Steps

### Backend:
1. ✅ Create/enhance POST /api/projects endpoint
2. ✅ Create/enhance PUT /api/projects/:id endpoint
3. ✅ Add transaction support for data consistency
4. ✅ Handle cascading deletes/updates

### Frontend (Admin):
1. ✅ Create ProjectsPage component
2. ✅ Build form sections
3. ✅ Add dynamic array management (add/remove items)
4. ✅ Integrate dropdowns (skills, categories)
5. ✅ Add image upload component
6. ✅ Add validation
7. ✅ Add submit handler with full payload

---

## Validation Rules

### Required Fields:
- title
- category
- type
- description

### Format Validations:
- URLs: Must be valid URL format
- Rating: 1-5 integer
- Arrays: Each item must have required fields
- Order fields: Non-negative integers

---

## Notes:
- All arrays can be empty (optional)
- Use transactions for data consistency
- Handle foreign key constraints gracefully
- Support both create and update operations
- Clear form state after successful submission


