import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { DeliveryStatus } from '@prisma/client'
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator'
import { Type } from 'class-transformer'

import { DeliveriesService } from './deliveries.service'

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  customerName: string

  @IsString()
  @IsNotEmpty()
  customerPhone: string

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string

  @IsString()
  @IsNotEmpty()
  itemDescription: string

  @Type(() => Number)
  @IsInt()
  retailerId: number
}

export class AssignRiderDto {
  @Type(() => Number)
  @IsInt()
  riderId: number
}

export class UpdateStatusDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus
}

export class AddProofOfDeliveryDto {
  @IsString()
  @IsNotEmpty()
  proofOfDelivery: string
}

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(dto)
  }

  @Get()
  findAll() {
    return this.deliveriesService.findAll()
  }

  @Get('riders')
  findRiders() {
    return this.deliveriesService.findRiders()
  }

  @Patch(':id/assign')
  assignRider(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRiderDto,
  ) {
    return this.deliveriesService.assignRider(id, dto.riderId)
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.deliveriesService.updateStatus(id, dto.status)
  }

  @Patch(':id/proof')
  addProofOfDelivery(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddProofOfDeliveryDto,
  ) {
    return this.deliveriesService.addProofOfDelivery(
      id,
      dto.proofOfDelivery,
    )
  }
}