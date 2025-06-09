import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../product/models/product.model';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'reviews', timestamps: true })
export class Review extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_reply: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  comment: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @HasMany(() => Review, {
    foreignKey: 'parent_id',
    as: 'replies',
  })
  replies: Review[];
}
