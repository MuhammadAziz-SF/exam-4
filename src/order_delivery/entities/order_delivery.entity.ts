import { Column,Model,Table,DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Delivers } from "src/delivers/model/delivery.model";
import { DeliveryStatus, Status } from "src/enum";
import { User } from "src/users/entities/user.entity";
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
      
      @ForeignKey(()=>Delivers)
      @Column({
        type:DataType.INTEGER
      })
      delever_id:number;
      @BelongsTo(()=>Delivers,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
      })

      @ForeignKey(()=>User)
      @Column({
        type:DataType.INTEGER
      })
      buyer_id:number;
      @BelongsTo(()=>User,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
      })
      user:User
}
