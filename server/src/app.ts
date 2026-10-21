import type {Express, Request, Response} from 'express';
import express from 'express';
import path from 'node:path';

const app: Express = express();

app.use(express.json());

app.post('/categorize', (req: Request, res: Response) => {
console.log(req.body)
    res.send({category: 'Placeholder', urgency: 'unknown'})
})

app.get('/test', (req: Request, res: Response) => {
    res.send("App working??")
})

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});


app.listen(3000);