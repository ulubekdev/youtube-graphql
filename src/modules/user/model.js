import db from "#pg";
import query from "./sql.js";

async function getUsers({ page, limit }) {
    return await db(query.GET_USERS, (page - 1) * limit, limit);
}

async function getUser({ userId, username }) {
    const [ user ] = await db(query.GET_USER, userId, username);
    return user;
}

async function register({ username, password, image }) {
    const [ user ] = await db(query.REGISTER, username, password, image);
    return user;
}

export default {
    getUsers,
    getUser,
    register
};