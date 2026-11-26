import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/security/request';

type Actor = { id?: string; email?: string } | null;

export async function audit(
  actor: Actor,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actor?.id,
        actorEmail: actor?.email,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
  } catch (error) {
    logError('audit', error);
  }
}
