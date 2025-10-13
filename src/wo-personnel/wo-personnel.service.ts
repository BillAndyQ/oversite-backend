import { Injectable } from '@nestjs/common';
import { CreateWoPersonnelDto } from './dto/create-wo-personnel.dto';
import { UpdateWoPersonnelDto } from './dto/update-wo-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WoPersonnel } from './entities/wo-personnel.entity';
import { Repository } from 'typeorm';
import { SequenceService } from 'src/sequence/sequence.service';
import { Not, IsNull } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import { Readable } from 'stream';
import { PhotosPersona } from './entities/photos-persona.entity';

@Injectable()
export class WoPersonnelService {

  
  constructor(
    @InjectRepository(WoPersonnel) private readonly woPersonnelRepository: Repository<WoPersonnel>,
    private readonly sequenceService: SequenceService,
    private readonly minioService: MinioService,
    @InjectRepository(PhotosPersona) private readonly photosRepository: Repository<PhotosPersona>,
  ) {}

  async create(createWoPersonnelDto: CreateWoPersonnelDto) {
    const n_order  = await this.sequenceService.generateOrder();

    const woPersonnel = this.woPersonnelRepository.create({
      ...createWoPersonnelDto,
      n_order,
    });
    return this.woPersonnelRepository.save(woPersonnel);
  }

  async findAll() {
    const personnel = await this.woPersonnelRepository.find({where: {n_order: Not(IsNull())}});
    if (!personnel) {
      throw new Error('Personnel not found');
    }
    return personnel;
  }

  findOne(n_order: string) {
    return this.woPersonnelRepository.findOne({where: {n_order}});
  }

  update(n_order: string, updateWoPersonnelDto: UpdateWoPersonnelDto) {
    return this.woPersonnelRepository.update({n_order : n_order}, updateWoPersonnelDto);
  }

  remove(n_order: string) {
    return this.woPersonnelRepository.delete({n_order : n_order});
  }
    
  async uploadCertificate(n_order: string, file: Express.Multer.File) {
    const bucketName = 'oversite';
    const extension = file.originalname.split('.').pop();
    const fileName = `certificado/${n_order}`;
    const fileUrl = await this.minioService.uploadFile(bucketName, fileName, file.buffer, file.mimetype);
    
    return this.woPersonnelRepository.update({n_order : n_order}, {src_certificate : fileName + '.' + extension});

  }

  async getCertificate(n_order: string): Promise<{ stream: Readable; contentType: string; fileName: string }> {
      const personnel = await this.woPersonnelRepository.findOne({where: {n_order}});
      console.log(personnel);
      if (!personnel) {
        throw new Error('Personnel not found');
      }
      const result = await this.minioService.getObject('oversite', `${personnel.src_certificate}`);
      
      return {
        stream: result.stream,            // Asegúrate que este es Readable
        contentType: result.contentType,
        fileName: `${personnel.src_certificate}`,
      };
    
  }

  async uploadFieldReport(n_order: string, file: Express.Multer.File) {
    const bucketName = 'oversite';
    const extension = file.originalname.split('.').pop();
    const fileName = `field-report/${n_order}`;
    const fileUrl = await this.minioService.uploadFile(bucketName, fileName, file.buffer, file.mimetype);
    
    return this.woPersonnelRepository.update({n_order : n_order}, {src_field_report : fileName + '.' + extension});

  }

  async getFieldReport(n_order: string): Promise<{ stream: Readable; contentType: string; fileName: string }> {
      const personnel = await this.woPersonnelRepository.findOne({where: {n_order}});
      console.log(personnel);
      if (!personnel) {
        throw new Error('Personnel not found');
      }
      const result = await this.minioService.getObject('oversite', `${personnel.src_field_report}`);
      
      return {
        stream: result.stream,            // Asegúrate que este es Readable
        contentType: result.contentType,
        fileName: `${personnel.src_field_report}`,
      };
    
  }

  async getUnidadPhotos(n_order: string) {
    const unidad = await this.woPersonnelRepository.findOne({
      where: { n_order },
      relations: ['photos'],
    });

    if (!unidad) throw new Error('No se encontró la Unidad');

    return Promise.all(
      unidad.photos.map(async (photo) => ({
        id: photo.id,
        url: await this.minioService.getPublicUrl('oversite', photo.src),
      }))
    );
  }

  async createUnidadPhoto(
    n_order: string,
    files: Express.Multer.File[],
  ) {
    const personnel = await this.woPersonnelRepository.findOne({ where: { n_order } });
    if (!personnel) throw new Error('No se encontró la OT Equipo');

    const bucketName = 'oversite';

    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const extension = file.originalname.split('.').pop();
        const fileName = `fotos/${personnel.n_order}/${Date.now()}_${file.originalname}`;
        const fileUrl = await this.minioService.uploadFile(
          bucketName,
          fileName,
          file.buffer,
          file.mimetype,
        );

        const photo = this.photosRepository.create({
          src: `${fileName}.${extension}`,
          woPersonnel: personnel,
        });
        await this.photosRepository.save(photo);

        return {
          originalName: file.originalname,
          url: fileUrl,
          dbPath: `${fileName}.${extension}`,
        };
      }),
    );

    return {
      message: `${uploadedPhotos.length} foto(s) subida(s) correctamente a MinIO`,
      files: uploadedPhotos,
    };
  }

}
