import { Column, Table, Model, DataType, PrimaryKey } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'delivers' })
export class Delivers extends Model<Delivers> {
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
    allowNull: false,
  })
  phone_number: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date_of_birth: string;
}
