import pool from '../database/pool'

//AIR
//para pintar en mapa
export async function getMeteoStations(req, res) {
    try {
        const response = await pool.query(
            `SELECT json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
                    json_build_object(
                        'type',       'Feature',
                        'properties', json_build_object(
                            'codigo', codigo,
                            'codigo_cor', codigo_cor,
                            'estacion', estacion,
                            'direccion', direccion,
                            'lon_geogra', lon_geogra,
                            'lat_geogra', lat_geogra,
                            'altitud', altitud,
                            'v_viento', v_viento,
                            'dir_viento', dir_viento,
                            'temperatura', temperatura,
                            'hum_rel', hum_rel,
                            'presion', presion,
                            'rad_solar', rad_solar,
                            'precipitacion', precipitacion
                            
                        ),
                        'geometry',   ST_AsGeoJSON(geom)::json
                    )
                )
            ) AS geojson
            FROM meteostations`
        )
        res.status(200).json(response.rows[0]);

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