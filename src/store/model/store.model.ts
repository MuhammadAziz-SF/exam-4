import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { StoreStatus } from 'src/enum';
import { User } from '../../users/entities/user.entity';

@Table({ 
  tableName: 'store',
  timestamps: true,
  paranoid: true
})
export class Store extends Model {
  @ForeignKey(() => User)
  @Column({ 
    type: DataType.INTEGER,
    allowNull: false
  })
  seller_id: number;

  @BelongsTo(() => User)
  seller: User;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  store_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
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
    type: DataType.ENUM('OPEN', 'CLOSED', 'MAINTENANCE', 'PAUSED', 'INACTIVE'),
    defaultValue: 'INACTIVE'
  })
  store_status: StoreStatus;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5
    }
  })
  rating: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  is_open: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo_url: string;
}
