-- CreateIndex
CREATE INDEX "openSlot_resource_start_idx" ON "OpenSlot"("resourceId", "start");

-- RedefineIndex
DROP INDEX "OpenSlot_resourceId_start_key";
CREATE UNIQUE INDEX "openSlot_resource_start_unique" ON "OpenSlot"("resourceId", "start");
