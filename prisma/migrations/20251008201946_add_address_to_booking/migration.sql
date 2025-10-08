/*
  Warnings:

  - Added the required column `address` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceId" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'booked',
    "cancelToken" TEXT,
    "cancelTokenExpires" DATETIME,
    CONSTRAINT "Booking_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("cancelToken", "cancelTokenExpires", "createdAt", "email", "end", "id", "name", "phone", "resourceId", "start", "status") SELECT "cancelToken", "cancelTokenExpires", "createdAt", "email", "end", "id", "name", "phone", "resourceId", "start", "status" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE UNIQUE INDEX "Booking_cancelToken_key" ON "Booking"("cancelToken");
CREATE UNIQUE INDEX "Booking_resourceId_start_key" ON "Booking"("resourceId", "start");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
