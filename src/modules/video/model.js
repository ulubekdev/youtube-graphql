import db from "#pg";
import query from "./sql.js";

async function getVideos({ page, limit, search }) {
    return await db(query.GET_VIDEOS, (page - 1) * limit, limit, search);
}

async function getVideo({ videoId }) {
    const [ video ] = await db(query.GET_VIDEO, videoId );
    return video;
}

async function myVideos({ page, limit, search, userId }) {
    const [ videos ] = await db(query.GET_MY_VIDEOS, (page - 1) * limit, limit, search, userId);
    return videos;
}

async function uploadVideo({ title, video_url, video_size, mime_type, userId }) {
    const [ video ] = await db(query.UPLOAD_VIDEO, title, video_url, video_size, mime_type, userId);
    return video;
}

async function deleteVideo({ videoId }) {
    const [ video ] = await db(query.DELETE_VIDEO, videoId);
    return video;
}

async function updateVideo({ videoId, title  }) {
    const [ video ] = await db(query.UPDATE_VIDEO, videoId, title);
    return video;
}

export default {
    getVideos,
    getVideo,
    myVideos,
    uploadVideo,
    deleteVideo,
    updateVideo
};