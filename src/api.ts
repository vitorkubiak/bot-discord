import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (_, response) => {
    response.send({
        server: "online"
    })
})

app.listen(3333);