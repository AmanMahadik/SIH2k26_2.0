// packages/db/src/repositories/applicationRepository.ts
import { query } from '../pool';
import { Application } from '@nirikshai/shared-types';

export class ApplicationRepository {
  async findById(id: string): Promise<Application | null> {
    const res = await query<Application>(
      'SELECT * FROM applications WHERE id = $1 LIMIT 1',
      [id]
    );
    return res.rows[0] || null;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await query(
      'UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
  }

  async listRecent(limit: number = 20): Promise<Application[]> {
    const res = await query<Application>(
      'SELECT * FROM applications ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return res.rows;
  }
}
