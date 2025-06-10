import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  PrimaryKey,
} from 'sequelize-typescript';
import { StoreStatus } from 'src/enum';
import { User } from '../../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'store',
  timestamps: true,
  paranoid: true,
})
export class Store extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: () => uuidv4(),
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  seller_id: string;

  @BelongsTo(() => User)
  seller: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  store_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
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
    type: DataType.ENUM(...Object.values(StoreStatus)),
    allowNull: true,
    defaultValue: StoreStatus.INACTIVE,
  })
  store_status: StoreStatus;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5,
    },
  })
  rating: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_open: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo_url: string;
}
