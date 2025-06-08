import { Column, Model, Table, DataType, PrimaryKey } from "sequelize-typescript";
import { DeliveryStatus, Status } from "src/enum";
import { v4 as uuidv4 } from 'uuid';

@Table({tableName:'order_delivery'})
export class OrderDelivery extends Model{
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => uuidv4(),
    })
    declare id: string;
    
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
    
    @Column({
        type: DataType.ENUM(Status.ACTIVE, Status.INACTIVE),
        allowNull: false,
        defaultValue: Status.ACTIVE,
      })
      status: string;

      @Column({
        type: DataType.ENUM(
            DeliveryStatus.COMPLETED,
            DeliveryStatus.DELIVERING,
            DeliveryStatus.PREPARING,
            DeliveryStatus.RECEIVED,
            DeliveryStatus.REJECTED),
        allowNull: false,
        defaultValue: DeliveryStatus.RECEIVED,
      })
      delivery_status: string;
}
