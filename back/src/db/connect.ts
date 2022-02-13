import { CONFIG } from "../config/config"
import * as mysql from 'mysql'
import { log } from "../utils/logger"

const DEFAULT_CONNECTIONS_LIMIT = 10

const params = {
    connectionLimit: DEFAULT_CONNECTIONS_LIMIT,
    host: CONFIG.MYSQL_HOST,
    database: CONFIG.MYSQL_DATABASE,
    user: CONFIG.MYSQL_USER,
    password: CONFIG.MYSQL_PASSWORD
}

if (!CONFIG.MYSQL_USER) {
    log.warn('Mysql database user is empty!')
}

if (!CONFIG.MYSQL_USER) {
    log.warn('Mysql database password is empty!')
}

export const db = mysql.createPool(params)