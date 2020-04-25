import pool from '../database/pool'

//AIR
//para pintar en mapa
export async function getAirStations(req, res) {
    try {
        const response = await pool.query(
            'SELECT * FROM airstations'
        )
        res.status(200).json(response.rows);

    } catch (e) { 
        console.log(e) 
    }
}

//para poblar con info el pop-up small
export async function getAirStationInfoById(req, res) {
    // const id = parseInt(req.params);
    // const query = {
    //     text: 'SELECT codigo_cor, estacion, direccion, lon_geogra, lat_geogra, altitud, no2, so2, co, pm10, pm2_5, o3, btx, hc FROM airstations WHERE codigo_cor = $1',
    //     values: [id]
    // }
    // pool
    //     .query(query)
    //     .then(res.json(query.rows))
    //     .catch(e => console.log(e))
    try {
        const codigo_cor = req.params;
        const response = await pool.query(
            'SELECT codigo_cor, estacion, direccion, lon_geogra, lat_geogra, altitud, no2, so2, co, pm10, pm2_5, o3, btx, hc FROM airstations WHERE codigo_cor = $1',
            [codigo_cor]
        )
        res.json(response.rows)

    } catch (e) { console.log(e) }


}


//METEO