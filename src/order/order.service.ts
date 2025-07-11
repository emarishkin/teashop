import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { EnumOrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  private readonly checkout: YooCheckout;

  constructor(private prisma: PrismaService) {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    if (!shopId || !secretKey) {
      throw new Error('YooKassa credentials are not configured');
    }

    this.checkout = new YooCheckout({
      shopId,
      secretKey
    });
  }

  async createPayment(dto:OrderDto,userId:string) {
    const orderItems = dto.items.map(item=>({
        quantity:item.quantity,
        price:item.price,
        product:{
            connect:{
                id:item.productId
            }
        },
        store:{
            connect:{
                id:item.storeId
            }
        }
    }))
    const total = dto.items.reduce((acc,item)=>{
        return acc + item.price * item.quantity
    },0)

    const order = await this.prisma.order.create({
        data:{
            status:dto.status,
            items:{
                create:orderItems
            },
            total,
            user: {
                connect: {
                    id:userId
                }
            }
        }
    })

    const payment = await this.checkout.createPayment({
        amount:{
            value:total.toFixed(2),
            currency:'RUB'
        },
        payment_method_data:{
            type:'bank_card'
        },
        confirmation:{
            type:'redirect',
            return_url:`${process.env.CLIENT_URL}/thanks`
        },
        description:`Оплата заказа в магазине TeaShop. Id платежа: #${order.id}`
    })

    return payment

  }

  async updateStatus(dto:PaymentStatusDto) {
    if(dto.event === 'payment.waiting_for_capture'){
        const capturePayment:ICapturePayment = {
            amount:{
                value:dto.object.amount.value,
                currency:dto.object.amount.currency
            }
        }
        return this.checkout.capturePayment(dto.object.id,capturePayment)
    }

    if(dto.event === 'payment.succeeded'){
        const orderId = dto.object.description.split('#')[1]

        await this.prisma.order.update({
            where:{
                id:orderId
            },
            data:{
                status:EnumOrderStatus.PAYED
            }
        })
        return true
    }
  }



}