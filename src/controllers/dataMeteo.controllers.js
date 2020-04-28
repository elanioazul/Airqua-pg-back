import pool from '../database/pool'

//para tener datos con los que pintar en el grafico
export async function getMeteoDataByStation(req, res) {
    const station = req.params.stationid;
    const { magnitud, ano, mes, dia } = req.body;

    try {
        const response = await pool.query(
            'SELECT h01, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, h21, h22, h23, h24 FROM meteodata WHERE estacion = $1 AND magnitud = $2 AND ano = $3 AND mes = $4 AND dia = $5', [station, magnitud, ano, mes, dia]
        )
        console
        .log(response.rows);
        res.status(200).json(response.rows);
        
    } catch (e) {
        console.log(e)
    }
}