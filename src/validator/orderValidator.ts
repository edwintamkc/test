import dotenv from 'dotenv'

dotenv.config()

// validate coordinate type
// 1. data type should be an array with exactly two elements
// 2. every element in the array should be string
const isCoordinateTypeValid = (data: any): boolean => {

    // check data type and length
    if (!Array.isArray(data) || data.length !== 2) {
        return false
    }

    // check element type
    for (let i = 0; i < data.length; i++) {
        if (typeof data[i] !== 'string') {
            return false
        }
    }

    return true
}

// validate coordinate range
const isCoordinateRangeValid = (latitude: number, longitude: number): boolean => {
    if (latitude < -90 || latitude > 90) {
        return false
    }

    if (longitude < -180 || longitude > 180) {
        return false
    }

    return true
}

// validate page / limit
const isPageOrLimitValid = (data: any): boolean => {
    
    // if it is not pure number, i.e., there are special charaters, then return false
    if(isNaN(Number(data))){
        return false
    }

    // if smaller than 1, return false
    if(Number(data) < 1){
        return false
    }

    return true
}

export { isCoordinateTypeValid, isCoordinateRangeValid, isPageOrLimitValid }