import db from '../config/dbConfig'
import { Order } from "../entity/Order"
import { Repository } from 'typeorm'
import moment from 'moment'
import { getDistance } from '../utils/orderUtils'
import dotenv from 'dotenv'

dotenv.config()
const orderRepository: Repository<Order> = db.getRepository(Order)

// place order service
const placeOrderService = async (origin: string[], destination: string[]): Promise<Order> => {
    const currentTime: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    try {
        const order = new Order()
        order.startLatitude = origin[0]
        order.startLongitude = origin[1]
        order.endLatitude = destination[0]
        order.endLongitude = destination[1]
        order.distance = await getDistance(origin, destination)
        order.creationTime = currentTime
        order.lastModifyTime = currentTime

        const result = await orderRepository.save(order)
        return result

    } catch (error: any) {
        throw new Error(error.message)
    }
}

// take order service
const takeOrderService = async (orderId: number) => {
    const currentTime: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    const queryRunner = db.createQueryRunner()
    try {
        await queryRunner.connect()
        await queryRunner.startTransaction()

        // add write lock to the row using 'for update' keyword
        const orderList: Order[] = await queryRunner
            .query(`select * from test.order where order_id = ${orderId} for update`)

        const order = orderList[0]

        // check errors
        if (!order) {
            throw new Error(process.env.ORDER_NOT_FOUND)
        }

        if (order.status === process.env.ORDER_TAKEN) {
            throw new Error(process.env.ORDER_HAS_ALREADY_BE_TAKEN)
        }

        // update order status
        order.status = process.env.ORDER_TAKEN + ''
        order.lastModifyTime = currentTime

        await queryRunner
            .query(`update test.order set status = '${process.env.ORDER_TAKEN}' where order_id = ${orderId}`)
        
        await queryRunner.commitTransaction()

    } catch (error: any) {

        await queryRunner.rollbackTransaction()
        throw new Error(error.message)

    } finally {

        await queryRunner.release()

    }
}

const getOrderListService = async (page: number, limit: number): Promise<Order[]> => {
    try {
        const orderList = await orderRepository.find({
            take: limit,
            skip: limit * (page - 1),
            select: {
                id: true,
                distance: true,
                status: true
            }
        })

        return orderList

    } catch (error: any) {
        throw new Error(error.message)
    }
}

export default { placeOrderService, takeOrderService, getOrderListService }