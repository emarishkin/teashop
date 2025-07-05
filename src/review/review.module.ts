import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ProductService } from 'src/product/product.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService,PrismaService,ProductService],
})
export class ReviewModule {}
