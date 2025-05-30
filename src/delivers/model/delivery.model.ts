import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'delivers' })
export class Delivers extends Model<Delivers> {
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
