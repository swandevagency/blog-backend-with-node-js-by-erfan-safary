import express, {Application} from "express";
import morgan from "morgan";
import bodyParser from 'body-parser';

import blogs from './controllers/blog';
import users from './controllers/user';

const PORT = process.env.PORT || 1337;

const app: Application = express();

app.use(morgan('tiny'));
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(blogs);
app.use(users);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
