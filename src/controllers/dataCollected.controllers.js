import pool from '../database/pool';



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

