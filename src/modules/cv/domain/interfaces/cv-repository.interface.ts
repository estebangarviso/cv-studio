import type { CvData } from '../entities/cv-data';

export interface CvRepository {
  list(): Promise<Pick<CvData, 'id' | 'name' | 'updatedAt'>[]>;
  getById(id: string): Promise<CvData | null>;
  save(cv: CvData): Promise<CvData>;
  delete(id: string): Promise<void>;
}
