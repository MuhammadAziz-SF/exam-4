import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Roles, Status } from 'src/enum';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'admins',
})
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
  declare full_name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare hashed_password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Roles)),
    allowNull: false,
    defaultValue: Roles.ADMIN,
  })
  declare role: Roles;

  @Column({
    type: DataType.ENUM(...Object.values(Status)),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  declare status: Status;
}
