import { Column, DataType, Model, Table } from "sequelize-typescript";
import { StoreStatus } from "src/enum";

@Table({tableName: "store"})

export class Store extends Model{ 
    @Column({
        type: DataType.STRING,
    })
    store_type: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    description: string

    @Column({
        type: DataType.STRING
    })
    contacts: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    store_name: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    location: string

    @Column({
        type: DataType.ENUM('open', 'closed', 'maintenance', 'paused', 'inactive')
    })
    store_status:StoreStatus

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    rating: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    is_open: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    logo_url: string
}
