import { Client, TravelMode } from "@googlemaps/google-maps-services-js"
import dotenv from 'dotenv'

dotenv.config()
const googleMapClient = new Client({})

// get driving distance from origin to destination
// params: origin coordinate, destination coordinate
const getDistance = async (origin: string[], destination: string[]) => {

    const result = await googleMapClient
        .distancematrix({
            params: {
                key: process.env.GOOGLE_API_KEY + '',
                origins: [origin[0] + ',' + origin[1]],
                destinations: [destination[0] + ',' + destination[1]],
                mode: TravelMode.driving
            },

            timeout: 1000
        })
        .catch((e) => {
            throw new Error(e.response.data.error_message)
        })
    
    return result.data.rows[0]?.elements[0]?.distance.value
}

export { getDistance }