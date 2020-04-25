import app from './app'
import '@babel/polyfill'//para convertir a js tradicional (dist folder)

require('dotenv').config();

async function main() {
    await app.listen(process.env.PORT)
    console.log(`Server listening on PORT ${process.env.PORT}`)
}

main();
