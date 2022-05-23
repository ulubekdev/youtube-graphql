const GET_VIDEOS = `
    SELECT
        videoid,
        title,
        video_url,
        video_size,
        mime_type,
        video_created_at,
        userid
    FROM videos
    WHERE title ILIKE CONCAT('%', $3::varchar, '%')
    OFFSET $1 LIMIT $2;
`;

const GET_VIDEO = `
        SELECT
            videoid,
            title,
            video_url,
            video_size,
            mime_type,
            video_created_at,
            userid
        FROM videos
        WHERE videoid = $1;
`;

const GET_MY_VIDEOS = `
    SELECT
        videoid,
        title,
        video_url,
        video_size,
        video_created_at,
        userid
    FROM videos
    WHERE userid = $4
    AND title ILIKE CONCAT('%', $3::varchar, '%')
    OFFSET $1 LIMIT $2;
`;

const UPLOAD_VIDEO = `
    INSERT INTO videos (title, video_url, video_size, mime_type, userid)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`;
const DELETE_VIDEO = `
    DELETE FROM videos
    WHERE videoid = $1
    RETURNING *;
`;

const UPDATE_VIDEO = `
    UPDATE videos
    SET title = $2
    WHERE videoid = $1
    RETURNING *;
`;

export default {
    GET_VIDEOS,
    GET_VIDEO,
    GET_MY_VIDEOS,
    UPLOAD_VIDEO,
    DELETE_VIDEO,
    UPDATE_VIDEO
}