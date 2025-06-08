import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Roles, Status } from 'src/enum';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../product/models/product.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  declare phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare hashed_password: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare date_of_birth: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare address: string;

  @Column({
    type: DataType.ENUM(Roles.BUYER, Roles.DELIVERY_AGENT, Roles.MANAGER, Roles.SELLER, Roles.SUPPORT),
    allowNull: true,
    defaultValue: Roles.BUYER,
  })
  declare role: Roles;

  @Column({
    type: DataType.ENUM(Status.ACTIVE, Status.INACTIVE),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  declare status: Status;

  @HasMany(() => Product)
  declare products: Product[];
}
