export type ParkingSpaceStatus = 
    | 'AVAILABLE'
    | 'OCCUPIED' 
    | 'OUT_OF_SERVICE'

export type ParkingSpaceType =
    | 'REGULAR'
    | 'DISABLED'
    | 'MOTORCYCLE'

export interface ParkingSpace {
    id: string
    code: string
    zone: string
    type: ParkingSpaceType
    status: ParkingSpaceStatus
    active: boolean
}
