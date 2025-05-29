import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { StoreStatus } from 'src/enum';
import { User } from 'src/users/entity/user.entitiy';

@Table({ tableName: 'store' })
export class Store extends Model {

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  seller_id: number;

  @BelongsTo(() => User)
  seller: User;

  @Column({
    type: DataType.STRING,
  })
  store_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  contacts: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  store_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.ENUM('open', 'closed', 'maintenance', 'paused', 'inactive'),
  })
  store_status: StoreStatus;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  rating: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_open: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo_url: string;
}
