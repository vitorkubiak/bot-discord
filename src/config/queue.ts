import Queue from 'bull';

import redisConfig from './redis.config';

const videoQueue = new Queue('video transcoding', redisConfig);

videoQueue.client.flushall()

export default videoQueue;