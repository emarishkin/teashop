import { IsBoolean, IsEnum, IsNumberString, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AmountPayment {
    @IsString({ message: 'Значение суммы должно быть строкой' })
    value: string;

    @IsString({ message: 'Валюта должна быть строкой' })
    currency: string;
}

export class PaymentMethod {
    @IsString({ message: 'Тип платежного метода должен быть строкой' })
    type: string;

    @IsString({ message: 'ID платежного метода должен быть строкой' })
    id: string;

    @IsBoolean({ message: 'Saved должен быть boolean' })
    saved: boolean;

    @IsString({ message: 'Название должно быть строкой' })
    title: string;

    @IsString({ message: 'Данные карты должны быть строкой' })
    card: string;
}

export class ObjectPayment {
    @IsString({ message: 'ID должно быть строкой' })
    id: string;

    @IsString({ message: 'Статус должен быть строкой' })
    status: string;

    @ValidateNested()
    @Type(() => AmountPayment)
    amount: AmountPayment; 
    @ValidateNested()
    @Type(() => PaymentMethod)
    payment_method: PaymentMethod;

    @IsString({ message: 'Дата создания должна быть строкой' })
    created_at: string;

    @IsString({ message: 'Дата истечения должна быть строкой' })
    expires_at: string;

    @IsString({ message: 'Описание должно быть строкой' })
    description: string;
}

export class PaymentStatusDto {
    @IsEnum([
        'payment.succeeded',
        'payment.waiting_for_capture',
        'payment.canceled',
        'refund.succeeded'
    ], { message: 'Некорректный тип события' })
    event: 'payment.succeeded' | 'payment.waiting_for_capture' | 'payment.canceled' | 'refund.succeeded';

    @IsString({ message: 'Тип должен быть строкой' })
    type: string;

    @ValidateNested()
    @Type(() => ObjectPayment)
    object: ObjectPayment;
}