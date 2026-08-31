import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { DeliveryStatus } from '@prisma/client'
import { DeliveriesService } from './deliveries.service'

export class CreateDeliveryDto {
  customerName: string
  customerPhone: string
  deliveryAddress: string
  itemDescription: string
}

export class AssignRiderDto {
  riderId: number
}

export class UpdateStatusDto {
  status: DeliveryStatus
}

export class AddProofOfDeliveryDto {
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
    return this.deliveriesService.addProofOfDelivery(id, dto.proofOfDelivery)
  }
}