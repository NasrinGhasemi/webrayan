-- CreateTable
CREATE TABLE "AuthLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "environment" TEXT NOT NULL DEFAULT 'development',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuthLog_type_timestamp_idx" ON "AuthLog"("type", "timestamp");
CREATE INDEX "AuthLog_userId_timestamp_idx" ON "AuthLog"("userId", "timestamp");
