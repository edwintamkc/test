import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Order } from '../entity/Order'

dotenv.config()
const db = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DB_PORT || '', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    entities: [Order],
    logging: true,
    synchronize: true
})

db.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.log("Error during Data Source initialization:", err)
    })

export default db