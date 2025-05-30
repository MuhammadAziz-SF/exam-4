import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Status } from 'src/enum';
@Table({ tableName: 'products', timestamps: true })
export class Product extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4, 
    allowNull: false,
  })
  // id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pictures: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  quantity: bigint;

  @Column({
    type: DataType.ENUM(Status.ACTIVE, Status.INACTIVE),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  seller_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category_type: string;
}
