import express, { json } from 'express'
import morgan from 'morgan'

//IMPOTING ROUTES
import usersRoutes from './routes/users.routes';
import collectorRoutes from './routes/collector.routes';
import madridRoutes from './routes/madrid.routes';


//INICIALIZATIOn
const app = express();

//MIDDLEWARE
//basic middlewares para ver peticiones por consola
app.use(morgan('dev'))
//basic middlewares para que cuando la appweb nos mande un formato json (de los formularios por ejemplo), que el servidor lo entienda
app.use(json())
//middleware para convertir url en objetos
app.use(express.urlencoded({extended: false}));


//ROUTES DEFINITION
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/airstations', madridRoutes);




export default app;