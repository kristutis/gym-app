require('dotenv').config();

export const CONFIG = {
    PORT: process.env.PORT || 3000,
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
    MYSQL_USER: process.env.MYSQL_USER || '',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
}
