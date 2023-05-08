import app from "../app"
import request from 'supertest'
import dotenv from 'dotenv'
import { getDistance } from "../utils/orderUtils"
import { Order } from "../entity/Order"

dotenv.config()

// PLACE ORDER TESTING SUITES
describe('place order', () => {
    describe('given wrong param type(number)', () => {
        it('return http status 400 and error', async () => {
            // invalid param type (number)
            const requestBody = {
                origin: [90, 90],
                destination: [90, 90]
            }

            const response = await request(app).post('/orders').send(requestBody)

            expect(response.status).toEqual(400)
            expect(response.body.error).toEqual(process.env.INVALID_PARAMS)
        })
    })

    describe('given wrong param type(special char)', () => {
        it('return http status 500 and error', async () => {
            // invalid param type (special charaters)
            const requestBody = {
                origin: ['1542@/*', '90'],
                destination: ['90', '90']
            }

            const response = await request(app).post('/orders').send(requestBody)

            expect(response.status).toEqual(500)
            expect(response.body).toHaveProperty('error')
        })
    })

    describe('given wrong param range', () => {
        it('return http status 400 and error', async () => {
            // invalid param range
            const requestBody = {
                origin: ['200', '200'],
                destination: ['90', '90']
            }

            const response = await request(app).post('/orders').send(requestBody)

            expect(response.status).toEqual(400)
            expect(response.body.error).toEqual(process.env.INVALID_PARAMS)
        })
    })

    describe('given correct params', () => {
        it('return correct response', async () => {
            // valid param type and valid param range
            const requestBody = {
                origin: ['22.372496', '114.178079'],
                destination: ['22.381365', '114.187878']
            }

            const response = await request(app).post('/orders').send(requestBody)
            //const distance = await getDistance(requestBody.origin, requestBody.destination)

            expect(response.status).toEqual(200)
            expect(response.body).toHaveProperty('id'),
                //expect(response.body.distance).toEqual(distance),
                expect(response.body.status).toEqual(process.env.ORDER_UNASSIGNED)
        })
    })
})

// TAKE ORDER TESTING SUITES
describe('take order', () => {
    describe('given wrong order id type (string)', () => {
        it('return http status 500 and error', async () => {
            const orderId: string = '4'
            const requestBody = {
                status: 'TAKEN'
            }
            const response = await request(app).patch(`/orders/${orderId}`).send(requestBody)

            expect(response.status).toEqual(500)
            expect(response.body).toHaveProperty('error')
        })
    })

    describe('given invalid order id', () => {
        it('return http status 500 and error', async () => {
            const orderId: number = -999
            const requestBody = {
                status: 'TAKEN'
            }
            const response = await request(app).patch(`/orders/${orderId}`).send(requestBody)

            expect(response.status).toEqual(500)
            expect(response.body).toHaveProperty('error')
        })
    })

    describe('given valid order id', () => {
        it('return http status 200 and success message', async () => {
            // place order
            const requestBodyPlaceOrder = {
                origin: ['22.372496', '114.178079'],
                destination: ['22.381365', '114.187878']
            }
            const responsePlaceOrder = await request(app).post('/orders').send(requestBodyPlaceOrder)

            // take order
            const orderId = responsePlaceOrder.body.id
            const requestBodyTakeOrder = {
                status: 'TAKEN'
            }
            const response = await request(app).patch(`/orders/${orderId}`).send(requestBodyTakeOrder)

            expect(response.status).toEqual(200)
            expect(response.body.status).toEqual(process.env.SUCCESS)
        })
    })

})

// GET ORDER LIST TESTING SUITES
describe('get order list', () => {
    describe('given wrong page number type', () => {
        it('return http status 400 and error', async () => {
            const page: string = '201@'
            const limit: number = 20

            const response = await request(app).get(`/orders/?page=${page}&limit=${limit}`)

            expect(response.status).toEqual(400)
            expect(response.body.error).toEqual(process.env.INVALID_PARAMS)
        })
    })

    describe('given invalid page number', () => {
        it('return http status 400 and error', async () => {
            const page: number = -999
            const limit: number = 20

            const response = await request(app).get(`/orders/?page=${page}&limit=${limit}`)

            expect(response.status).toEqual(400)
            expect(response.body.error).toEqual(process.env.INVALID_PARAMS)
        })
    })

    describe('given correct params', () => {
        it('return http status 200 and json list', async () => {
            const page: number = 1
            const limit: number = 20

            const response = await request(app).get(`/orders/?page=${page}&limit=${limit}`)

            expect(response.status).toEqual(200)
            expect(response.body).toBeInstanceOf(Array)
        })
    })
})