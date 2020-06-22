import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (request: Request, response:Response) => {
    response.send({
        server: "online"
    })
})

app.listen(process.env.PORT || 5000, () => console.log("🚀 Botzera API tá online gurizao"));