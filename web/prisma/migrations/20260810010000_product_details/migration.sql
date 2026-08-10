-- Add per-product medical detail fields (ingredients, dosage, usage, conditions).
ALTER TABLE "Product" ADD COLUMN "ingredients" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Product" ADD COLUMN "dosage" TEXT;
ALTER TABLE "Product" ADD COLUMN "usage" TEXT;
ALTER TABLE "Product" ADD COLUMN "conditions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
