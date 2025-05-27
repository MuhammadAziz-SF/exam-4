import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Roles, Status } from 'src/enum';
import { v4 as uuidv4 } from 'uuid'; 

@Table({ tableName: 'admins' })
export class Admin extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: () => uuidv4(), 
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Roles)),
    allowNull: false,
    defaultValue: Roles.ADMIN,
  })
  role: Roles;

  @Column({
    type: DataType.ENUM(...Object.values(Status)),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: Status;
}
