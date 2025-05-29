import { BelongsTo, Column, DataType, Model, Table} from "sequelize-typescript";

@Table({tableName: "cart"})

export class Cart extends Model{
    // @BelongsTo(()=> orderItem)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    order_id: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    order_total_price: number

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    order_info: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    user_id: number

}