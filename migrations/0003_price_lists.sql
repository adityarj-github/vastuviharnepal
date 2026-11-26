-- Migration 0003: Price List Module and Audit Log tables for Cloudflare D1
CREATE TABLE IF NOT EXISTS "PriceList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "data" TEXT,
    "pdfDesign" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "activeFrom" TEXT,
    "activeUntil" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "PriceList_slug_key" ON "PriceList"("slug");

CREATE TABLE IF NOT EXISTS "PriceListTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "PriceListCity" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "details" TEXT,
    "updatedBy" TEXT
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial Nepal township cities
INSERT OR IGNORE INTO "PriceListCity" ("slug", "state", "name", "sortOrder", "isActive", "details") VALUES
    ('birtamode', 'Koshi Province', 'Birtamode', 0, 1, '{"officeAddress":"211, 2nd Floor, Hanuman Central, Mukti Chowk, Birtamode, Jhaapa","siteAddress":"Charpani, Near Heaven''s Water Park, Birtamode, Nepal","contactPhones":"9705191816","email":"info@vastuvihar.org","footerMessage":"Thanks For Visiting Vastu Vihar Nepal"}'),
    ('birgunj', 'Madhesh Province', 'Birgunj Branch', 1, 1, '{"officeAddress":"Shop No-8, 2nd Floor, Aadarshnagar, Rungta Mall, Birgunj, Nepal","siteAddress":"Lukahi Mai, Laxmanwa, Birgunj, Nepal","contactPhones":"9802591815","email":"info@vastuvihar.org","footerMessage":"Thanks For Visiting Vastu Vihar Nepal"}');
