BEGIN;

CREATE TABLE IF NOT EXISTS projects (
  id                BIGSERIAL PRIMARY KEY,
  title             TEXT NOT NULL,
  category          TEXT NOT NULL,
  type              TEXT NOT NULL,
  description       TEXT NOT NULL,
  subtitle          TEXT,
  long_description  TEXT,
  timeline          TEXT,
  team              TEXT,
  role              TEXT,
  budget            TEXT,
  client            TEXT,
  cover_image_url   TEXT,
  highlight         TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_links (
  project_id     BIGINT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  live           TEXT,
  github         TEXT,
  documentation  TEXT,
  case_study     TEXT,
  demo           TEXT
);

CREATE TABLE IF NOT EXISTS technologies (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT UNIQUE NOT NULL,
  category   TEXT NOT NULL,
  icon       TEXT
);

CREATE TABLE IF NOT EXISTS project_technologies (
  project_id     BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id  BIGINT NOT NULL REFERENCES technologies(id) ON DELETE RESTRICT,
  level          TEXT,
  PRIMARY KEY (project_id, technology_id)
);
CREATE INDEX IF NOT EXISTS idx_project_tech_project ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tech_technology ON project_technologies(technology_id);

CREATE TABLE IF NOT EXISTS project_images (
  id          BIGSERIAL PRIMARY KEY,
  project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  caption     TEXT NOT NULL,
  type        TEXT NOT NULL,
  "order"     INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);

CREATE TABLE IF NOT EXISTS project_features (
  id          BIGSERIAL PRIMARY KEY,
  project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_key    TEXT,
  status      TEXT NOT NULL,
  impact      TEXT,
  "order"     INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_features_project ON project_features(project_id);

CREATE TABLE IF NOT EXISTS project_roadmap_phases (
  id              BIGSERIAL PRIMARY KEY,
  project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase           TEXT NOT NULL,
  description     TEXT NOT NULL,
  duration        TEXT NOT NULL,
  status          TEXT NOT NULL,
  deliverables    TEXT[] NOT NULL DEFAULT '{}',
  challenges      TEXT[] NOT NULL DEFAULT '{}',
  solutions       TEXT[] NOT NULL DEFAULT '{}',
  "order"         INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_roadmap_project ON project_roadmap_phases(project_id);

CREATE TABLE IF NOT EXISTS project_stats (
  id            BIGSERIAL PRIMARY KEY,
  project_id    BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,
  value         TEXT NOT NULL,
  is_list_stat  BOOLEAN NOT NULL DEFAULT FALSE,
  "order"       INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_stats_project ON project_stats(project_id);

CREATE TABLE IF NOT EXISTS project_metrics (
  id          BIGSERIAL PRIMARY KEY,
  project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key         TEXT NOT NULL,
  value       TEXT NOT NULL,
  "order"     INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_metrics_project ON project_metrics(project_id);

CREATE TABLE IF NOT EXISTS project_testimonials (
  id          BIGSERIAL PRIMARY KEY,
  project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  company     TEXT NOT NULL,
  quote       TEXT NOT NULL,
  rating      INT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  "order"     INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_testimonials_project ON project_testimonials(project_id);

CREATE TABLE IF NOT EXISTS skills (
  id        BIGSERIAL PRIMARY KEY,
  name      TEXT UNIQUE NOT NULL,
  category  TEXT NOT NULL,
  color     TEXT,
  icon_key  TEXT
);

CREATE TABLE IF NOT EXISTS skill_projects (
  skill_id     BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  project_id   BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contribution TEXT,
  complexity   TEXT,
  PRIMARY KEY (skill_id, project_id)
);
CREATE INDEX IF NOT EXISTS idx_skill_projects_project ON skill_projects(project_id);

COMMIT;


