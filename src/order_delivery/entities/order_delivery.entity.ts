import { Column,Model,Table,DataType } from "sequelize-typescript";
import { DeliveryStatus, Status } from "src/enum";
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
