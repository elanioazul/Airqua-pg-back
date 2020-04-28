import express, { json } from 'express'
import morgan from 'morgan'
import cors from 'cors'

//IMPOTING ROUTES
import usersRoutes from './routes/users.routes';
import dataCollected from './routes/dataCollected.routes'
import airStations from './routes/stationsAir.routes';
import meteoStations from './routes/stationsMeteo.routes';
import airData from './routes/dataAir.routes';
import meteoData from './routes/dataMeteo.routes';



//INICIALIZATIOn
const app = express();


//MIDDLEWARE

//basic middlewares para ver peticiones por consola
app.use(morgan('dev'))
// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
//basic middlewares para que cuando la appweb nos mande un formato json (de los formularios por ejemplo), que el servidor lo entienda
app.use(json())
//middleware para convertir url en objetos
app.use(express.urlencoded({extended : false}));


//ROUTES DEFINITION
app.use('/api/v1/users', usersRoutes);

app.use('/api/v1/datacollected', dataCollected);

app.use('/api/v1/airstations', airStations);
app.use('/api/v1/meteostations', meteoStations);

app.use('/api/v1/airdata', airData);
app.use('/api/v1/meteodata', meteoData);




//MIDDLEWARE ERROR HANDLING

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;