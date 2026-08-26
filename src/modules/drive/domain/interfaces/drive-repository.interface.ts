import type { DriveFile } from '../entities/drive-file';

export interface DriveRepository {
  listFiles(folderId: string): Promise<DriveFile[]>;
  getFile(fileId: string): Promise<string>;
  createFile(folderId: string, name: string, content: string, mimeType?: string): Promise<DriveFile>;
  updateFile(fileId: string, content: string): Promise<DriveFile>;
  deleteFile(fileId: string): Promise<void>;
  getOrCreateFolder(name: string): Promise<string>;
}
