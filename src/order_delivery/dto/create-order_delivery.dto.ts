import { IsNotEmpty, IsString,IsEnum } from "class-validator";
import { DeliveryStatus, Status } from "src/enum";
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

@IsNotEmpty()
@IsEnum(Status)
status: string;

@IsNotEmpty()
@IsEnum(DeliveryStatus)
delivery_status: string;
}
