/*
  Warnings:

  - A unique constraint covering the columns `[resourceId,start]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_resourceId_start_key" ON "Booking"("resourceId", "start");
