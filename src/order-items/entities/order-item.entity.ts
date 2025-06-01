import { UUIDV4 } from 'sequelize';
import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'orderItem', timestamps: true })
export class OrderItem extends Model{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  quantity: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  total_price: bigint;
}
