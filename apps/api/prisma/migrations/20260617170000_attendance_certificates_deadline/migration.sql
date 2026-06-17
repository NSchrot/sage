ALTER TABLE "activities" ADD COLUMN "registrationDeadline" TIMESTAMP(3);

UPDATE "activities"
SET "registrationDeadline" = "startsAt"
WHERE "registrationDeadline" IS NULL;

ALTER TABLE "activities" ALTER COLUMN "registrationDeadline" SET NOT NULL;

ALTER TABLE "enrollments" ADD COLUMN "attendanceConfirmedAt" TIMESTAMP(3);
ALTER TABLE "enrollments" ADD COLUMN "certificateIssuedAt" TIMESTAMP(3);
ALTER TABLE "enrollments" ADD COLUMN "certificateCode" TEXT;

CREATE UNIQUE INDEX "enrollments_certificateCode_key" ON "enrollments"("certificateCode");
