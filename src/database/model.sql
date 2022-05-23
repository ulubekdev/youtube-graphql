\c postgres

DROP DATABASE IF EXISTS youtube;
CREATE DATABASE youtube;

\c youtube

-- users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    userid serial PRIMARY KEY,
    username varchar(50) NOT NULL,
    password TEXT NOT NULL,
    image TEXT NOT NULL,
    user_created_at TIMESTAMPTZ DEFAULT NOW(),
    user_deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- videos
DROP TABLE IF EXISTS videos;
CREATE TABLE videos (
    videoid serial PRIMARY KEY,
    title varchar(50) NOT NULL,
    video_url TEXT NOT NULL,
    video_size TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    userid integer NOT NULL,
    video_created_at TIMESTAMPTZ DEFAULT NOW(),
    video_deleted_at TIMESTAMPTZ DEFAULT NULL,
    FOREIGN KEY (userid) REFERENCES users(userid)
);