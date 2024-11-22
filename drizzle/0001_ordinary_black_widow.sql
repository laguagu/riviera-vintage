ALTER TABLE "Chunk" DROP CONSTRAINT "Chunk_uploaded_by_User_email_fk";
--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "role" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Chunk" DROP COLUMN IF EXISTS "uploaded_by";