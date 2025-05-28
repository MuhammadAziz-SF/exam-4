import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Roles } from 'src/enum';

@Table({ tableName: 'users' })
export class User extends Model{
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone_number!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM(Roles.BUYER, Roles.DELIVERY_AGENT, Roles.MANAGER, Roles.SELLER, Roles.SUPPORT),
    allowNull: false,
    defaultValue: Roles.BUYER,
  })
  role!: Roles;
}
