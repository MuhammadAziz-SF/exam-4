import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Status } from 'src/enum';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Table({ tableName: 'products' })
export class Product extends Model {
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
  declare name: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare pictures: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare quantity: bigint;

  @Column({
    type: DataType.ENUM(Status.ACTIVE, Status.INACTIVE),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  declare status: Status;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare seller_id: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare category_id: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare created_at: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare updated_at: Date;

  @BelongsTo(() => User)
  declare seller: User;

  @BelongsTo(() => Category)
  declare category: Category;
}
