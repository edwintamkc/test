import { Request, Response } from 'express'
import orderService from "../services/orderService"
import {
    isCoordinateTypeValid,
    isCoordinateRangeValid,
    isPageOrLimitValid
} from '../validator/orderValidator'
import dotenv from 'dotenv'

dotenv.config()

const placeOrderController = async (req: Request, res: Response) => {
    try {
        const origin = req.body.origin
        const destination = req.body.destination

        // validate params type
        if (!isCoordinateTypeValid(origin) || !isCoordinateTypeValid(destination)) {
            return res.status(400).json({
                error: process.env.INVALID_PARAMS
            })
        }

        // validate params range
        if (!isCoordinateRangeValid(origin[0], origin[1]) || !isCoordinateRangeValid(destination[0], destination[1])) {
            return res.status(400).json({
                error: process.env.INVALID_PARAMS
            })
        }

        const order = await orderService.placeOrderService(origin, destination)

        return res.status(200).json({
            id: order.id,
            distance: order.distance,
            status: order.status
        })

    } catch (error: any) {
        return res.status(500).json({
            error: process.env.UNEXPECTED_ERROR + ": " + error.message
        })
    }

}

const takeOrderController = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id, 10)

        await orderService.takeOrderService(orderId)

        return res.status(200).json({
            status: process.env.SUCCESS
        })

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const getOrderListController = async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query

        if (!isPageOrLimitValid(page) || !isPageOrLimitValid(limit)) {
            return res.status(400).json({
                error: process.env.INVALID_PARAMS
            })
        }

        const orderList = await orderService.getOrderListService(Number(page), Number(limit))

        return res.status(200).send(orderList)

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        })
    }
}

export default { placeOrderController, takeOrderController, getOrderListController }