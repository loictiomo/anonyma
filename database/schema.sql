-- =====================================================
-- Base de données PostgreSQL Anonyma
-- Structure complète
-- =====================================================


-- Suppression des anciennes tables si elles existent
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS reactions CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS users CASCADE;



-- =====================================================
-- TABLE USERS
-- =====================================================

CREATE TABLE users (

    id SERIAL PRIMARY KEY,

    username VARCHAR(30) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    reputation_score INTEGER DEFAULT 0,

    status VARCHAR(20) DEFAULT 'active',

    role VARCHAR(20) DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    last_login_at TIMESTAMP

);





-- =====================================================
-- TABLE COMMUNITIES
-- =====================================================

CREATE TABLE communities (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    slug VARCHAR(100) UNIQUE NOT NULL,

    description TEXT,

    rules TEXT,

    status VARCHAR(20) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);







-- =====================================================
-- TABLE POSTS
-- =====================================================

CREATE TABLE posts (

    id SERIAL PRIMARY KEY,


    user_id INTEGER NOT NULL,


    community_id INTEGER NOT NULL,


    content TEXT NOT NULL,


    is_fully_anonymous BOOLEAN DEFAULT false,


    status VARCHAR(20) DEFAULT 'visible',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_posts_user

    FOREIGN KEY(user_id)

    REFERENCES users(id)

    ON DELETE CASCADE,



    CONSTRAINT fk_posts_community

    FOREIGN KEY(community_id)

    REFERENCES communities(id)

    ON DELETE CASCADE

);









-- =====================================================
-- TABLE COMMENTS
-- =====================================================

CREATE TABLE comments (

    id SERIAL PRIMARY KEY,


    post_id INTEGER NOT NULL,


    user_id INTEGER NOT NULL,


    content TEXT NOT NULL,


    is_fully_anonymous BOOLEAN DEFAULT true,


    status VARCHAR(20) DEFAULT 'visible',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_comments_post

    FOREIGN KEY(post_id)

    REFERENCES posts(id)

    ON DELETE CASCADE,



    CONSTRAINT fk_comments_user

    FOREIGN KEY(user_id)

    REFERENCES users(id)

    ON DELETE CASCADE

);









-- =====================================================
-- TABLE REACTIONS
-- =====================================================

CREATE TABLE reactions (

    id SERIAL PRIMARY KEY,


    user_id INTEGER NOT NULL,


    post_id INTEGER NOT NULL,


    type VARCHAR(30) DEFAULT 'like',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_reactions_user

    FOREIGN KEY(user_id)

    REFERENCES users(id)

    ON DELETE CASCADE,



    CONSTRAINT fk_reactions_post

    FOREIGN KEY(post_id)

    REFERENCES posts(id)

    ON DELETE CASCADE,



    CONSTRAINT unique_user_post_reaction

    UNIQUE(user_id, post_id)

);









-- =====================================================
-- TABLE REPORTS
-- =====================================================

CREATE TABLE reports (

    id SERIAL PRIMARY KEY,


    reporter_id INTEGER NOT NULL,


    post_id INTEGER,


    comment_id INTEGER,


    reason VARCHAR(50) NOT NULL,


    details TEXT,


    status VARCHAR(20) DEFAULT 'pending',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_reports_user

    FOREIGN KEY(reporter_id)

    REFERENCES users(id)

    ON DELETE CASCADE,



    CONSTRAINT fk_reports_post

    FOREIGN KEY(post_id)

    REFERENCES posts(id)

    ON DELETE CASCADE,



    CONSTRAINT fk_reports_comment

    FOREIGN KEY(comment_id)

    REFERENCES comments(id)

    ON DELETE CASCADE

);








-- =====================================================
-- DONNEES DE TEST : COMMUNAUTES
-- =====================================================


INSERT INTO communities
(name, slug, description, rules)

VALUES

(
'Discussion générale',
'general',
'Espace libre pour discuter de tous les sujets.',
'Respect et bienveillance obligatoires.'
),


(
'Vie étudiante',
'etudiants',
'Discussions entre étudiants.',
'Pas de harcèlement.'
),


(
'Technologie',
'tech',
'Programmation, IA et informatique.',
'Partager des connaissances.'
);
