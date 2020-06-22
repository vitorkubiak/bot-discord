import express from 'express';

const app = express();


app.get('/', (_, response) => {
    response.send({
        server: "online"
    })
})

app.listen(3333);