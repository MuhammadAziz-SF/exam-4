export {IsNotEmpty, IsEmail} from 'class-validator';

export class ConfirmLoginDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp:string;
}