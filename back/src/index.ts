import express, {Request, Response} from 'express'
import { Trainer } from './models/trainer';

const app = express();
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    const x: Trainer = {
        moto: "asd",
        name: 'asdad'
    }
    return res.json(x).send()
})

app.listen(3000, () => console.log('listening on port: 3000')) 