import pool from '../database/pool'

//AIR
//para pintar en mapa
export async function getMeteoStations(req, res) {
    try {
        const response = await pool.query(
            'SELECT * FROM meteostations'
        )
        res.status(200).json(response.rows);

    } catch (e) { 
        console.log(e) 
    }
}

//para poblar con info el pop-up small
export async function getMeteoStationbyId(req, res) {
    try {
        const id = req.params.id;
        const response = await pool.query(
            'SELECT codigo_cor, estacion, direccion, lon_geogra, lat_geogra, altitud, v_viento, dir_viento, temperatura, hum_rel, presion, rad_solar, precipitacion FROM meteostations WHERE codigo_cor = $1',
            [id]
        )
        res.json(response.rows)
        console.log(req.params.codigo_cor)
     
    } catch (e) { console.log(e) }


}