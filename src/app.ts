import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import orderRouter from './router/orderRouter'
import 'reflect-metadata'

const app = express()
app.use(cors())
app.use(express.json())

app.use(orderRouter)

dotenv.config()
app.listen(process.env.SERVER_PORT_NUMBER, () => {
    console.log('Server running at port ' + process.env.SERVER_PORT_NUMBER)
})

export default app