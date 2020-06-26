import 'dotenv/config';
import Queue from 'bull';

import redisConfig from './redis.config';

const videoQueue = new Queue('video transcoding', redisConfig);

videoQueue.client.flushall();

videoQueue.on('failed', (job, err) => {
  console.log(`Deu erro ${job}, ${err}`);
});

export default videoQueue;
