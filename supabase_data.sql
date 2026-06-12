-- =========================================================================
-- MIGRATION PRÉALABLE : Adaptation de la contrainte d'échelle de niveau (1-100)
-- =========================================================================
ALTER TABLE public.skills DROP CONSTRAINT IF EXISTS skills_level_check;
ALTER TABLE public.skills ADD CONSTRAINT skills_level_check CHECK (level >= 1 AND level <= 100);

-- =========================================================================
-- 1. PROFILES (Remplacez l'UUID ci-dessous par votre UUID Supabase Auth)
-- =========================================================================
INSERT INTO public.profiles (id, full_name, title, bio, email, github_url, linkedin_url, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- <-- METTRE VOTRE UUID ICI
  'Jefferson MBOUOPDA',
  'Ingénieur FullStack AI & Data',
  'Ingénieur en Génie Informatique spécialisé IA & Data, passionné par les architectures de données, le machine learning et le développement fullstack. Actuellement en alternance chez OTIS Elevator.',
  'tech.mbouopda.jeff@gmail.com',
  'https://github.com/jefferson1203',
  'https://linkedin.com/in/jefferson-mbouopda',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  email = EXCLUDED.email,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url,
  updated_at = now();

-- =========================================================================
-- 2. SKILLS (Compétences à l'échelle 1-100)
-- =========================================================================
INSERT INTO public.skills (name, category, level, order_index) VALUES
  ('Python',          'Data & IA',  90, 1),
  ('React',           'Frontend',   85, 2),
  ('Node.js',         'Backend',    80, 3),
  ('SQL / PostgreSQL','Database',   85, 4),
  ('Snowflake',       'Data & IA',  80, 5),
  ('MS Fabric',       'Data & IA',  75, 6),
  ('LangGraph',       'Data & IA',  70, 7),
  ('LlamaIndex',      'Data & IA',  70, 8),
  ('FastAPI',         'Backend',    80, 9),
  ('Docker',          'DevOps',     75, 10),
  ('GCP / Azure',     'DevOps',     70, 11),
  ('GitHub Actions',  'DevOps',     75, 12),
  ('PySpark',         'Data & IA',  70, 13),
  ('TailwindCSS',     'Frontend',   85, 14),
  ('Power BI',        'Data & IA',  70, 15)
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 3. EDUCATION (Parcours académique)
-- =========================================================================
INSERT INTO public.education (degree, school, year_start, year_end, description, order_index) VALUES
(
  'Diplôme d''Ingénieur — Génie Informatique, IA & Data',
  'UTC — Université de Technologie de Compiègne',
  2023, 2026,
  'ML, NLP, Data Warehousing, RAG, Algorithmique avancée, Fullstack, Scrum Agile, Architecture Système',
  1
),
(
  'Classes Préparatoires MPSI',
  'PrépaVogt, Yaoundé, Cameroun',
  2021, 2023,
  'Mathématiques, Physique & Sciences de l''ingénieur',
  2
)
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 4. TOOLS (Référentiel des outils techniques)
-- =========================================================================
INSERT INTO public.tools (name, category) VALUES
  ('React',          'Framework'),
  ('Node.js',        'Framework'),
  ('FastAPI',        'Framework'),
  ('TailwindCSS',    'Framework'),
  ('AdonisJS',       'Framework'),
  ('Python',         'Language'),
  ('TypeScript',     'Language'),
  ('SQL',            'Language'),
  ('PySpark',         'Language'),
  ('PostgreSQL',     'Database'),
  ('Snowflake',      'Database'),
  ('MS Fabric',      'Database'),
  ('Docker',         'DevOps'),
  ('GitHub Actions', 'DevOps'),
  ('Traefik',        'DevOps'),
  ('GCP',            'Cloud'),
  ('Azure',          'Cloud'),
  ('LangGraph',      'IA'),
  ('LlamaIndex',     'IA'),
  ('Power BI',       'BI')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 5. PROJECTS (Projets réalisés)
-- =========================================================================
INSERT INTO public.projects (title, description, url, github_url, status, iframe_blocked, order_index)
VALUES
(
  'BloomPower',
  'Plateforme SaaS de simulation énergétique hybride. Architecture microservices en Monorepo (TurboRepo), moteur de simulation mathématique du mix énergétique (Solaire, Éolien, Géothermie, Stockage), intégration PostGIS pour l''optimisation géographique des sites.',
  '',
  '',
  'en_cours',
  true,
  1
),
(
  'TedInsights',
  'Blog de résumés de conférences TED avec support bilingue français/anglais. Interface moderne avec système de commentaires, console admin et déploiement Vercel.',
  'https://blog-ted.vercel.app',
  'https://github.com/jefferson1203/blog-ted',
  'en_ligne',
  false,
  2
)
ON CONFLICT DO NOTHING;

-- Liaison des outils du projet BloomPower
INSERT INTO public.project_tools (project_id, tool_id)
SELECT p.id, t.id
FROM public.projects p, public.tools t
WHERE p.title = 'BloomPower'
  AND t.name IN ('React', 'FastAPI', 'PostgreSQL', 'Docker', 'TailwindCSS', 'Python')
ON CONFLICT DO NOTHING;

-- Liaison des outils du projet TedInsights
INSERT INTO public.project_tools (project_id, tool_id)
SELECT p.id, t.id
FROM public.projects p, public.tools t
WHERE p.title = 'TedInsights'
  AND t.name IN ('React', 'Node.js', 'TailwindCSS', 'PostgreSQL')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 6. TRAININGS (Suivi d'études et certifications)
-- =========================================================================
INSERT INTO public.trainings (title, platform, category, status, progress, order_index) VALUES
(
  'Microsoft DP-600 — Fabric Analytics Engineer',
  'Microsoft',
  'Data & IA',
  'termine',
  100,
  1
),
(
  'IBM RAG & Agentic AI',
  'IBM',
  'Data & IA',
  'en_cours',
  60,
  2
),
(
  'Plateforme de préparation Fabric',
  'Microsoft',
  'Data & IA',
  'termine',
  100,
  3
),
(
  'Google DeepMind GenAI — omni-access (Gemini 1.5 Pro)',
  'Google',
  'Data & IA',
  'termine',
  100,
  4
),
(
  'Google AI Agent Intensive — DiagnoSense',
  'Google',
  'Data & IA',
  'termine',
  100,
  5
),
(
  'Google Gen AI Intensive — Architectures RAG avancées',
  'Google',
  'Data & IA',
  'termine',
  100,
  6
)
ON CONFLICT DO NOTHING;
