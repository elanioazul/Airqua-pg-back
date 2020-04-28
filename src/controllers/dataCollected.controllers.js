import pool from '../database/pool';


//para pintar en el mapa
export async function getAllPoints(req, res) {
    try {

        const response = await pool.query('SELECT name, lon, lat FROM datacollected');
        res.json(response.rows)

    } catch (e) {
        console.log(e)
    }
}

//no pinta el usernameid (creo que por ser clave externa)
export async function createPoint(req, res) {
    const { username, name, ppm, description, lon, lat } = req.body;
    try {
        const response = await pool.query('INSERT INTO datacollected(usernameid, name, ppm, description, lon, lat) values ($1, $2, $3, $4, $5, $6)',
        [username, name, ppm, description, lon, lat])
        res.json({
            message: 'Point created successfully',
            body: {
                point: { name, ppm, description, lon, lat}
            }
        })
        console.log(response.rows)

    } catch (e) {
        console.log(e)
    }
}


//filtrado by user, para pintar en mapa
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

//filtrado by user, para mostrar en tabla
export async function getPointsByUserForTable(req, res) {
    const user = req.params.userid;
    const text = 'SELECT id, updated_at, name, ppm FROM datacollected WHERE usernameid = $1';
    const values = [user];
    try {
        const response = await pool.query(text, values)
        res.json(response.rows)
        console.log(response)

    } catch (e) {
        console.log(e)
    }
}

export async function updatePoint(req, res) {
    const id = req.params.userid;
    const { username, name, ppm, description } = req.body;
    try {
        const response = await pool.query('INSERT INTO datacollected(usernameid, name, ppm, description) values ($1, $2, $3, $4) WHERE id = $5',
        [name, ppm, description, id])
        res.json({
            message: 'updated successfully',
            body: {
                point: { name, ppm, description}
            }
        })

    } catch (e) {
        console.log(e)
    }
}


