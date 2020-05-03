import pool from '../database/pool';
import { errorMessage, status, successMessage } from '../helpers/status';
import { empty } from '../helpers/validations';



export async function getAllPoints(req, res) {
    try {

        const response = await pool.query('SELECT name, lon, lat FROM datacollected');
        res.json(response.rows)

    } catch (e) {
        console.log(e)
    }
}


export async function createPoint(req, res) {
    const { usernameid, name, ppm, description, lon, lat } = req.body;
    try {
        const response = await pool.query('INSERT INTO datacollected (usernameid, name, ppm, description, lon, lat) values ($1, $2, $3, $4, $5, $6)',
        [usernameid, name, ppm, description, lon, lat])
        res.json({
            message: 'Point created successfully',
            body: {
                point: { usernameid, name, ppm, description, lon, lat}
            }
        })
        console.log(response.rows)

    } catch (e) {
        console.log(e)
    }
}


export async function getPointsByUserForMap(req, res) {
    const user = req.params.userid;
    const text = 'SELECT name, lon, lat FROM datacollected WHERE usernameid = $1';
    const values = [user];
    try {
        const response = await pool.query(text, values)
        res.json(response.rows)
        console.log(response)

    } catch (e) {
        console.log(e)
    }
}


export async function getPointsByUserForTable(req, res) {
    const user = req.params.userid;
    const text = `SELECT id, date_trunc('second', cast(created_at as timestamp)), name, ppm FROM datacollected WHERE usernameid = $1 ORDER BY updated_at DESC`;
    const values = [user];
    try {
        const response = await pool.query(text, values)
        res.json(response.rows)
        console.log(response)

    } catch (e) {
        console.log(e)
    }
}

export async function createPointByUser(req, res) {
    const user = req.params.userid;
    const { name, ppm, description, lon, lat} = req.body;
    try {
        const response = await pool.query('INSERT INTO datacollected(usernameid, name, ppm, description, lon, lat) VALUES ($1, $2, $3, $4, $5, $6)',
        [user, name, ppm, description, lon, lat])
        res.json({
            message: 'Point created successfully',
            body: {
                point: { user, name, ppm, description, lon, lat}
            }
        })


    } catch (e) {
        console.log(e)
    }
}


export async function createPointByUserALTERNATIVE(req, res) {
    const {
        name, ppm, description, lon, lat
    } = req.body;

    const {
        id 
    } = req.user;

    if(empty(name || lon || lat)) {
        errorMessage.error = 'Name and coordinates are obligatory';
        return res.status(status.bad).send(errorMessage);
    }

    const createPointQuery = `INSERT INTO datacollected(usernameid, name, ppm, description, lon, lat) VALUES ($1, $2, $3, $4, $5, $6) returning *`
    const values = [id, name, ppm, description, lon, lat];

    try {
        const { rows } = await pool.query(createPointQuery, values);
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.created).send(successMessage);

    } catch (error) {
        if (error.routine === '_bt_check_unique') {
            errorMessage.error = 'Name of the point introduced is taken already';
            return res.status(status.conflict).send(errorMessage);
        }
        errorMessage.error = 'Unable to create user';
        return res.status(status.error).send(errorMessage);
    }
}

//como no son null ninguno, se pueden dejar sin meter por el formulario, pero si no se meten, se borran esos campos. ¿cómo mantener los datos de los campos que no actualizas?
export async function updatePointByUser(req, res) {
    const pointid = req.params.id;
    const usernameid = req.params.userid;
    const { name, ppm, description, lon, lat } = req.body;
    try {
        const response = await pool.query('UPDATE datacollected SET name = $1, ppm = $2, description = $3, lon = $4, lat = $5 WHERE id = $6 AND usernameid = $7',
        [name, ppm, description, lon, lat, pointid, usernameid])
        res.json({
            message: 'updated successfully',
            body: {
                point: { name, ppm, description, lon, lat}
            }
        })

    } catch (e) {
        console.log(e)
    }
}

//solo se actualiza el campo descripcion, pero querría que cualquiera se pudiese modificar
export async function updatePointByUserALTERNATIVE(req, res) {
    const { pointid } = req.params;
    const { pointdesc } = req.body;

    const { user_id } = req.user;

    if(empty(pointdesc)) {
        errorMessage.error = 'Description is needed';
        return res.status(status.bad).send(errorMessage);
    }
    const findPointQuery = 'SELECT * FROM datacollected WHERE id = $1';
    const updatePointQuery = 'UPDATE datacollected SET description = $1 WHERE id = $2 AND usernameid = $3';

    try {
        const { rows } = await pool.query(findPointQuery, [pointid]);
        const dbResponse = rows[0];
        if(!dbResponse) {
            errorMessage.error = 'Point cannot be found';
            return res.status(status.notfound).send(errorMessage);
        }
        const values = [pointid, pointdesc, user_id]
        const response = await pool.query(updatePointQuery, values);
        const dbResult = response.rows[0];
        successMessage.data = dbResult;
        return res.status(status.success).send(successMessage)
        
    } catch (error) {
        console.log(error)
    }

}

export async function deletePointByUser(req, res) {
    const id = req.params.id;
    const user = req.params.userid;
    try {
        const response = await pool.query('DELETE FROM datacollected WHERE id = $1 and usernameid = $2', [id, user])
        res.json({
            message: 'point deleted successfully'
            
        })
    }
    catch (e) {
        console.log(e)
    }
}

export async function deletePointByUserALTERNATIVE(req, res) {
    const { pointId } = req.params;
    const { user_id } = req.user;

    const deletePointQuery = 'DELETE FROM datacollected WHERE id = $1 AND usernameid = $2 returning *';
    try {
        const { rows } = await pool.query(deletePointQuery, [pointId, user_id]);
        const dbResponse = rows[0];
        if(!dbResponse) {
            errorMessage.error = 'You have no point collected with that id';
            return res.status(status.notfound).send(errorMessage);
        }
        successMessage.data = {};
        successMessage.data.message = 'Booking deleted successfully';
        return res.status(status.success).send(successMessage);

    } catch (error) {
        return res.status(status.error).send(error);

    }
}

