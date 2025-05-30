import { UUIDV4 } from 'sequelize';
import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'orderItem', timestamps: true })
export class OrderItem {
  static create(arg0: { product_id: string; price: number; quantity: bigint; total_price: bigint; }) {
    throw new Error('Method not implemented.');
  }
  static findAll() {
    throw new Error('Method not implemented.');
  }
  static findByPk(id: number) {
    throw new Error('Method not implemented.');
  }
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
