import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env')});

export const USER_CONFIG = {
    PAGINATION: {
        LIMIT: 10,
        PAGE: 1
    }
};
export const VIDEO_CONFIG = {
    PAGINATION: {
        LIMIT: 10,
        PAGE: 1
    }
};