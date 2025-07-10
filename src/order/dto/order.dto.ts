import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { EnumOrderStatus } from "@prisma/client";

export class OrderDto {
    @IsOptional()
    @IsEnum(EnumOrderStatus, {
       message: 'Некорректный статус заказа' // Изменено сообщение
    })
    status?: EnumOrderStatus; // Добавлен ? для явного указания необязательности

    @IsArray({
        message: 'В заказе нет ни одного товара'
    })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}

export class OrderItemDto {
    @IsNumber({}, { message: 'Количество должно быть числом' }) // Исправлено сообщение
    quantity: number;

    @IsNumber({}, { message: 'Цена должна быть числом' })
    price: number;

    @IsString({ message: 'ID продукта должен быть строкой' })
    productId: string;

    @IsString({ message: 'ID магазина должен быть строкой' })
    storeId: string;
}