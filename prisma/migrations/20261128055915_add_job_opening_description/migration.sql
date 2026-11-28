-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobOpening" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Full-Time',
    "location" TEXT NOT NULL DEFAULT 'Birtamode / Birgunj, Nepal',
    "description" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL DEFAULT '[]',
    "requirements" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_JobOpening" ("createdAt", "department", "description", "id", "isOpen", "jobId", "location", "requirements", "title", "type", "updatedAt") SELECT "createdAt", "department", "description", "id", "isOpen", "jobId", "location", "requirements", "title", "type", "updatedAt" FROM "JobOpening";
DROP TABLE "JobOpening";
ALTER TABLE "new_JobOpening" RENAME TO "JobOpening";
CREATE UNIQUE INDEX "JobOpening_jobId_key" ON "JobOpening"("jobId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
