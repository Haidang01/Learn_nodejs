import express from 'express';
import configViewEngine from './config/viewEngine';
import initWebRouter from './routes/web';
require('dotenv').config();
import bodyParser from 'body-parser';
import connection from './config/connectDB';
const app = express();
const PORT = process.env.PORT || 8080;

// config viewengine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//init web router
initWebRouter(app);

// test connection db
connection();

app.listen(PORT, () => {
    console.log('>>> JWT Backend is runing on port :' + PORT);
})