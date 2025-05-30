import { IsNumber, IsString } from "class-validator";

export class CreateCartDto {
    @IsNumber()
    order_id: number;

    @IsNumber()
    order_total_price: number;

    @IsString()
    order_info: string;

    @IsNumber()
    user_id: number;
}
