import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: {
    name: string
    email: string
    password: string
    role: 'RETAILER' | 'DISPATCHER' | 'RIDER'
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
  }

  async login(data: {
    email: string
    password: string
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (!user || user.password !== data.password) {
      return {
        message: 'Invalid email or password',
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}