import app from './app';
import { CONFIG } from './config/config';
import { log } from './utils/logger';

app.listen(CONFIG.PORT, () => log.info('listening on port: ' + CONFIG.PORT));
