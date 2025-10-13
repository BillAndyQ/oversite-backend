import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { Readable } from 'stream';
import { lookup } from 'mime-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
   private minioClient: Client;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') as string,
      port: Number(this.configService.get<string>('MINIO_PORT')) as number,
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') as string,
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY') as string,
    });

    this.baseUrl = `http://${this.configService.get<string>('MINIO_ENDPOINT')}:${this.configService.get<string>('MINIO_PORT')}`;
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    // Verificar si el bucket existe
    const exists = await this.minioClient.bucketExists(bucket);
    if (!exists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1');
    }
  
    // Obtener extensión del tipo MIME
    const extension = contentType.split('/')[1]; // e.g. 'image/png' → 'png'
    const finalName = `${fileName}.${extension}`;
  
    // Subir archivo
    await this.minioClient.putObject(
      bucket,
      finalName,
      buffer,
      buffer.length,
      { 'Content-Type': contentType }, // Importante para que se conserve el tipo MIME
    );
  
    return `${bucket}/${finalName}`;
  }

  async getObject(
    bucket: string,
    objectName: string
  ): Promise<{ stream: Readable; contentType: string }> {
    const exists = await this.minioClient.bucketExists(bucket);
    if (!exists) {
      throw new Error(`Bucket ${bucket} does not exist`);
    }

    const object = await this.minioClient.getObject(bucket, objectName);

    const contentType =
      (object as any).headers?.['content-type'] ||
      lookup(objectName) ||
      'application/octet-stream';

    return { stream: object as Readable, contentType };
  }
  /**
 * Genera una URL pública (firmada o directa) para acceder a un archivo en MinIO
 */
  async getPublicUrl(bucket: string, objectName: string): Promise<string> {
    return await this.minioClient.presignedGetObject(bucket, objectName, 24 * 60 * 60);
  }

}
