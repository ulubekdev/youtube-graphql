const GET_USERS = `
    SELECT 
        userid,
        username,
        password,
        image,
        user_created_at
    FROM users
    OFFSET $1 LIMIT $2;
`;

const GET_USER = `
    SELECT 
        userid,
        username,
        password,
        image,
        user_created_at
    FROM users
    WHERE userid = $1 OR username = $2
`;

const REGISTER = `
    INSERT INTO users (username, password, image)
    VALUES ($1, $2, $3)
    RETURNING userid, username, password, image, user_created_at
`;

export default {
    GET_USERS,
    GET_USER,
    REGISTER
};