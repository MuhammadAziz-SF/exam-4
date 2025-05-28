import { Column,Model,Table,DataType } from "sequelize-typescript";
@Table({tableName:'order_delivery'})
export class OrderDelivery extends Model{
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    order_info:string
    
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    deliver_number:string
    
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    buyer_number:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    message:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    address:string
    
}
