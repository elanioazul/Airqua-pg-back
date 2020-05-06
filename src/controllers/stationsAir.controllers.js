import pool from '../database/pool'

//AIR
//para pintar en mapa
export async function getAirStations(req, res) {
    try {
        const response = await pool.query(
            `SELECT json_build_object(
                'type', 'FeatureCollection',
                'crs',  'EPSG:4326', 
                'data', json_agg(
                    json_build_object(
                        'type',       'Feature',
                        'geometry',   ST_AsGeoJSON(geom)::json,
                        'properties', json_build_object(
                            -- list of fields
                            'codigo', codigo,
                            'codigo_cor', codigo_cor,
                            'estacion', estacion,
                            'direccion', direccion,
                            'lon_geogra', lon_geogra,
                            'lat_geogra', lat_geogra,
                            'altitud', altitud,
                            'no2', no2,
                            'so2', so2,
                            'co', co,
                            'pm10', pm10,
                            'pm2_5', pm2_5,
                            'o3', o3,
                            'btx', btx,
                            'hc', hc
                            
                        )
                    )
                )
            )
            FROM airstations`
        )
        res.status(200).json(response.rows);

    } catch (e) { 
        console.log(e) 
    }
}

//para poblar con info el pop-up small
export async function getAirStationbyId(req, res) {
    try {
        const id = req.params.id;
        const response = await pool.query(
            'SELECT codigo_cor, estacion, direccion, lon_geogra, lat_geogra, altitud, no2, so2, co, pm10, pm2_5, o3, btx, hc FROM airstations WHERE codigo_cor = $1',
            [id]
        )
        res.json(response.rows)
        console.log(req.params.codigo_cor)
     
    } catch (e) { console.log(e) }


}


