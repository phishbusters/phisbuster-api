import AWS from 'aws-sdk';
import { envPrivateVars } from './env-vars';

if (envPrivateVars.env === 'DEVELOPMENT') {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'sa-east-1', // e.g., us-west-2
  });
} else {
  AWS.config.update({
    region: 'sa-east-1', // e.g., us-west-2
  });
}

export const s3 = new AWS.S3();
