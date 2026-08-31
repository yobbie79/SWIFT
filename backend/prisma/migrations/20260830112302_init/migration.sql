-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('RETAILER', 'DISPATCHER', 'RIDER');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('ASSIGNED', 'PICKED_UP', 'DELIVERED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'ASSIGNED',
    "retailerId" INTEGER NOT NULL,
    "riderId" INTEGER,
    "proofOfDelivery" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
