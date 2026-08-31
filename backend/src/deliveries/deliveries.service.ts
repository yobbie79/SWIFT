import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliveryStatus } from '@prisma/client'

export interface CreateDeliveryDto {
  customerName: string
  customerPhone: string
  deliveryAddress: string
  itemDescription: string
}

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDeliveryDto, retailerId = 1) {
    return this.prisma.delivery.create({
      data: {
        ...data,
        retailerId,
      },
    })
  }

  async findAll() {
    return this.prisma.delivery.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rider: {
          select: { id: true, name: true, email: true },
        },
      },
    })
  }

  async findRiders() {
    return this.prisma.user.findMany({
      where: { role: 'RIDER' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
  }

  async assignRider(deliveryId: number, riderId: number) {
    await this.ensureDeliveryExists(deliveryId)

    return this.prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        riderId,
        status: DeliveryStatus.ASSIGNED,
      },
    })
  }

  async updateStatus(deliveryId: number, status: DeliveryStatus) {
    await this.ensureDeliveryExists(deliveryId)

    return this.prisma.delivery.update({
      where: { id: deliveryId },
      data: { status },
    })
  }

  async addProofOfDelivery(deliveryId: number, proofOfDelivery: string) {
    await this.ensureDeliveryExists(deliveryId)

    return this.prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        proofOfDelivery,
        status: DeliveryStatus.DELIVERED,
        deliveredAt: new Date(),
      },
    })
  }

  private async ensureDeliveryExists(id: number) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`)
    }
  }
}