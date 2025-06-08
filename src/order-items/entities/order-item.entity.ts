import { UUIDV4 } from 'sequelize';
import { Column, Table, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';
import { OrderDelivery } from '../../order_delivery/entities/order_delivery.entity';

@Table({ tableName: 'order_items', timestamps: true })
export class OrderItem extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id: string;

  @ForeignKey(() => OrderDelivery)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  order_id: string;

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
    type: DataType.DECIMAL,
    allowNull: false,
  })
  total_price: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => OrderDelivery)
  order: OrderDelivery;
}
