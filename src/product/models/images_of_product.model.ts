import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/product/models/product.model";

@Table({tableName: 'images_of_product'})
export class ImagesOfProduct extends Model{
    @Column({
        type: DataType.STRING,
        allowNull: false,

    })
    image_url: string;

    @ForeignKey(()=> Product)
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    product_id: number;

    @BelongsTo(()=> Product)
    product: Product;
}
