import 'dotenv/config';

export const envPrivateVars = {
  env: process.env.ENV || '',
  chatFlaskService: process.env.FLASK_API_URL || '',
  jwtTokenSecret: process.env.JWT_SECRET || '',
  apiPort: process.env.API_PORT || '',
  mongoDb: {
    user: process.env.MONGO_DB_USER || '',
    password: process.env.MONGO_DB_PASSWORD || '',
    host: process.env.MONGO_DB_HOST || '',
    port: process.env.MONGO_DB_PORT || '',
    database: process.env.MONGO_DB_DATABASE || '',
  },
};
