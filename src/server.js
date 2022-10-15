import express from 'express';
import configViewEngine from './config/viewEngine';
import initWebRouter from './routes/web';
import initApiRouter from './routes/api'
import configCors from './config/cors'
import bodyParser from 'body-parser';
import connection from './config/connectDB';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT || 8080;
import { createJWT, verifyToken } from './middleware/JWTAction';
// config CORS
configCors(app);

// config viewengine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// config cookie-pare
app.use(cookieParser())



// test JWT 
// createJWT();
// let decodedData = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFuZyIsImFkZHJlc3MiOiJoYSBub2kgIiwiaWF0IjoxNjY1Njg2NDg3fQ.VhFG2wJaNii3S5FloqauPMRKGf6WrnwMBq5IqoliPmI')
// console.log(decodedData);



//init web router
initWebRouter(app);
initApiRouter(app)

// req ->middleware ->res

// test connection db
connection();

app.listen(PORT, () => {
    console.log('>>> JWT Backend is runing on port :' + PORT);
})