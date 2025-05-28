import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDeliveryDto {
    @IsNotEmpty()
@IsString()
order_info:string;

@IsNotEmpty()
@IsString()
deliver_number:string

@IsNotEmpty()
@IsString()
buyer_number:string

@IsNotEmpty()
@IsString()
message:string

@IsNotEmpty()
@IsString()
address:string
}
