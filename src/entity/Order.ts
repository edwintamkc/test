import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('order')
export class Order extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'order_id'})
    id!: number

    @Column({type: 'varchar', length: 100, name: 'start_latitude'})
    startLatitude!: string

    @Column({type: 'varchar', length: 100, name: 'start_longitude'})
    startLongitude!: string

    @Column({type: 'varchar', length: 100, name: 'end_latitude'})
    endLatitude!: string

    @Column({type: 'varchar', length: 100, name: 'end_longitude'})
    endLongitude!: string

    @Column({type: 'int', name: 'distance'})
    distance!: number

    @Column({
		type: "enum",
		enum: ["UNASSIGNED", "TAKEN"],
		default: "UNASSIGNED"
	})
	status!: string

    @Column({type: 'varchar', length: 100, name: 'creation_time'})
    creationTime!: string

    @Column({type: 'varchar', length: 100, name: 'last_modify_time'})
    lastModifyTime!: string
}