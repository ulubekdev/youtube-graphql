import { finished } from 'stream/promises';
import path from 'path';
import fs from 'fs';
import model from './model.js';
import { VIDEO_CONFIG } from '#config/index';
import ip from '#utils/getIp';

export default {
    Query: {
        videos: (_, { pagination, search }) => {
            return model.getVideos({ 
                page: pagination?.page || VIDEO_CONFIG.PAGINATION.PAGE, 
                limit: pagination?.limit || VIDEO_CONFIG.PAGINATION.LIMIT,
                search
            });
        },

        video: (_, args) => {
            return model.getVideo(args);
        },

        myvideos: async (_, { pagination, search }, { userId }) => {
            if (!userId) {
                throw new Error('You are not authorized');
            }
            let video = await model.myVideos({
                page: pagination?.page || VIDEO_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || VIDEO_CONFIG.PAGINATION.LIMIT,
                search,
                userId
            });

            if(!video) {
                throw new Error('You have no videos');
            }

            return video;
        }
    },
    Mutation: {
        uploadVideo: async (_, { title, video }, { userId }) => {
            if (!userId) {
                throw new Error('You are not authorized');
            }

            const { filename, mimetype, createReadStream  } = await video;
            title = title.trim();
            const video_url = Date.now() + filename.replace(/\s/g, '');

            if(mimetype !== 'video/mp4') {
                throw new Error('Only mp4 video is allowed');
            }

            let video_size = 0;
            for await (const chunk of createReadStream()) {
                video_size += chunk.length;
            }            
            video_size = video_size / 1024 / 1024 + 'mb';

            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', 'videos', video_url));
            createReadStream().pipe(out);
            await finished(out);

            let newVideo = await model.uploadVideo({
                title,
                video_url,
                video_size,
                mime_type: mimetype,
                userId
            });
            
            return {
                status: 200,
                message: 'Upload success',
                data: newVideo
            }
        },

        deleteVideo: async (_, { videoId }, { userId }) => {
            if (!userId) {
                throw new Error('You are not authorized');
            }

            const video = await model.getVideo({ videoId });
            if(!video) {
                throw new Error('Video not found');
            }

            if(video.userid !== userId) {
                throw new Error('You are not authorized');
            }

            fs.unlinkSync(path.join(process.cwd(), 'uploads', 'videos', video.video_url));
            let delVideo = await model.deleteVideo({ videoId });

            return {
                status: 200,
                message: 'Video deleted',
                data: delVideo,
            };  
        },

        updateVideo: async (_, { videoId, title }, { userId }) => {
            if (!userId) {
                throw new Error('You are not authorized');
            }

            const video = await model.getVideo({ videoId });
            if(!video) {
                throw new Error('Video not found');
            }

            if(video.userid !== userId) {
                throw new Error('You are not authorized');
            }
            let updVideo = await model.updateVideo({ videoId, title });
            return {
                status: 200,
                message: 'Video updated',
                data: updVideo,
            }
        }
    },
    Video: {
        videoId: video => {
            return video.videoid;
        },
        video_url: global => `http://${ip({ internal: false })}:5000/${global.video_url}`
    }
};