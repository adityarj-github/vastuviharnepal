-- Seed initial Admin Users for Cloudflare D1
INSERT OR IGNORE INTO "User" ("id", "email", "password", "name", "role", "createdAt", "updatedAt") VALUES
('cmwvn9cyr0000m21o2np1iey8', 'info@vastuvihar.org', '$2b$10$h0NNsH8B9eexAneHj5NEDO78vwiM6XSVCV.fEhnsyZQcEgLhv4Deu', 'Root Admin', 'ROOT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cmwvn9cz10001m21ol8v1e73v', 'admin@vastuvihar.org', '$2b$10$0tIEjKUh666YbGPwxQNyMOS3J893WyqlphH/81jvtecI6OE9p9GhK', 'Operations Admin', 'SALES', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cmwvonhdk0001m21nvt9rf19y', 'media@vastuvihar.org', '$2b$10$0vg5r.R7rLWAYkslJZuQ8OKHRebiPRcV4dzRDx1wLVj0FvMViH53S', 'Media Team', 'MEDIA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cmwvonhdq0002m21nlwcz4fp2', 'hr@vastuvihar.org', '$2b$10$JNEvNX14xbRD8/a3uAVSuO9SSscZUEKsnD8hKGHK5O75EzZp7VFLW', 'HR Team', 'HR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cmwvonhe00003m21nosjof2iz', 'sales@vastuvihar.org', '$2b$10$ea4YsY5g4KRBTqgDHQVGneKTKlb.7VdaQNM/.qyqlom6sx66HAROy', 'Sales Team', 'SALES', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
