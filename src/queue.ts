import { Job, DoneCallback } from 'bull';
import Queue from './config/queue';

Queue.process((job: Job, done: DoneCallback) => {
    console.log(`Job executando: ${job.id} com o link ${job.data}`);
    done();
});