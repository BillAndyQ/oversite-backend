import { Injectable } from '@nestjs/common';
import { CreateOtEquipoDto } from './dto/create-ot-equipo.dto';
import { UpdateOtEquipoDto } from './dto/update-ot-equipo.dto';
import { OtEquipo } from './entities/ot-equipo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SequenceService } from 'src/sequence/sequence.service';
import { Not, IsNull } from 'typeorm';
import { Unidad } from 'src/unidad/entities/unidad.entity';
import { CreateUnidadDto } from 'src/unidad/dto/create-unidad.dto';
import { UpdateUnidadDto } from 'src/unidad/dto/update-unidad.dto';
import { MinioService } from 'src/minio/minio.service';
import { Readable } from 'stream';
import { Photos } from './entities/photos.entity';

@Injectable()
export class OtEquipoService {

  constructor(
    @InjectRepository(OtEquipo) private readonly otEquipoRepository: Repository<OtEquipo>,
    @InjectRepository(Unidad) private readonly unidadRepository: Repository<Unidad>,
    @InjectRepository(Photos) private readonly photosRepository: Repository<Photos>,
    private readonly sequenceService: SequenceService,
    private readonly minioService: MinioService,
  ) {}  

  async create(createOtEquipoDto: CreateOtEquipoDto) {
    const n_order  = await this.sequenceService.generateOrder();

    const otEquipo = this.otEquipoRepository.create({
      ...createOtEquipoDto,
      n_order,
    });
    return this.otEquipoRepository.save(otEquipo);
  }

  findAll() {
    return this.otEquipoRepository.find({where: {n_order: Not(IsNull())}, order: {n_order: 'ASC'}});
  }

  findOne(n_order: string) {
    return this.otEquipoRepository.findOne({where: {n_order}});
  }

  update(n_order: string, updateOtEquipoDto: UpdateOtEquipoDto) {
    return this.otEquipoRepository.update( {n_order : n_order}, updateOtEquipoDto);
  }

  remove(n_order: string) {
    return this.otEquipoRepository.delete({n_order : n_order});
  }

  async findAllUnidad(n_order: string) {
    const ot_equipo = await this.otEquipoRepository.find({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const unidades = await this.unidadRepository.find({
      where: { ot_equipo },
      order: { code: 'ASC' }
    });

    return unidades;
  }

  async createUnidad(n_order: string, createUnidadDto: CreateUnidadDto) {
    const ot_equipo = await this.otEquipoRepository.findOne({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const new_code = await this.sequenceService.generateCode(n_order);
    console.log(new_code);
    
    const unidad = this.unidadRepository.create({
      ...createUnidadDto,
      code : new_code,
      ot_equipo,
    });
    return this.unidadRepository.save(unidad);
  }

  async removeUnidad(n_order: string, id: number) {

    const ot_equipo = await this.otEquipoRepository.findOne({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const unidad = this.unidadRepository.findOne({where: {id : id, ot_equipo : ot_equipo}});

    if (!unidad) {
      throw new Error('No se encontro la Unidad');
    }

    return this.unidadRepository.delete({id : id, ot_equipo : ot_equipo});
  }

  async updateUnidad(n_order: string, id: number, updateUnidadDto: UpdateUnidadDto) {
    const ot_equipo = await this.otEquipoRepository.findOne({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const unidad = this.unidadRepository.findOne({where: {id : id, ot_equipo : ot_equipo}});

    if (!unidad) {
      throw new Error('No se encontro la Unidad');
    }

    return this.unidadRepository.update({id : id, ot_equipo : ot_equipo}, updateUnidadDto);
  }
  
  async updateUnidadFile(
    n_order: string,
    id: number,
    file: Express.Multer.File,
  ) {
    // Buscar OT Equipo
    const ot_equipo = await this.otEquipoRepository.findOne({ where: { n_order } });
    if (!ot_equipo) throw new Error('No se encontró la OT Equipo');

    // Buscar Unidad
    const unidad = await this.unidadRepository.findOne({ where: { id, ot_equipo } });
    if (!unidad) throw new Error('No se encontró la Unidad');

    // Subir a MinIO
    const bucketName = 'oversite';
    const extension = file.originalname.split('.').pop();
    const fileName = `certificado/${unidad.code}`;
    const fileUrl = await this.minioService.uploadFile(bucketName, fileName, file.buffer, file.mimetype);

    // Actualizar unidad con la ruta del archivo
    await this.unidadRepository.update(
      { id },
      { src_certificate: fileName + '.' + extension }
    );

    return { message: 'Archivo subido a MinIO correctamente', fileUrl };
  }

  async getUnidadFile(n_order: string, id: number): Promise<{ stream: Readable; contentType: string; fileName: string }> {
  
    const unidad = await this.unidadRepository.findOne({where: {id : id, ot_equipo : {n_order : n_order}}});
    if (!unidad) {
      throw new Error('No se encontro la Unidad');
    }

    console.log(unidad);

    const result = await this.minioService.getObject('oversite', `${unidad.src_certificate}`);
    
    return {
      stream: result.stream,            // Asegúrate que este es Readable
      contentType: result.contentType,
      fileName: `${unidad.src_certificate}`,
    };
  }


  // FIELD REPORT
  async updateUnidadFieldReport(
    n_order: string,
    id: number,
    file: Express.Multer.File,
  ) {
    // Buscar OT Equipo
    const ot_equipo = await this.otEquipoRepository.findOne({ where: { n_order } });
    if (!ot_equipo) throw new Error('No se encontró la OT Equipo');

    // Buscar Unidad
    const unidad = await this.unidadRepository.findOne({ where: { id, ot_equipo } });
    if (!unidad) throw new Error('No se encontró la Unidad');

    // Subir a MinIO
    const bucketName = 'oversite';
    const extension = file.originalname.split('.').pop();
    const fileName = `reporte-campo/${unidad.code}`;
    const fileUrl = await this.minioService.uploadFile(bucketName, fileName, file.buffer, file.mimetype);

    // Actualizar unidad con la ruta del archivo
    await this.unidadRepository.update(
      { id },
      { src_field_report: fileName + '.' + extension }
    );

    return { message: 'Archivo subido a MinIO correctamente', fileUrl };
  }

  async getUnidadFieldReport(n_order: string, id: number): Promise<{ stream: Readable; contentType: string; fileName: string }> {
  
    const unidad = await this.unidadRepository.findOne({where: {id : id, ot_equipo : {n_order : n_order}}});
    if (!unidad) {
      throw new Error('No se encontro la Unidad');
    }

    console.log(unidad);

    const result = await this.minioService.getObject('oversite', `${unidad.src_field_report}`);
    
    return {
      stream: result.stream,            // Asegúrate que este es Readable
      contentType: result.contentType,
      fileName: `${unidad.src_field_report}`,
    };
  }


  // FINAL REPORT
  async updateUnidadFinalReport(
    n_order: string,
    id: number,
    file: Express.Multer.File,
  ) {
    // Buscar OT Equipo
    const ot_equipo = await this.otEquipoRepository.findOne({ where: { n_order } });
    if (!ot_equipo) throw new Error('No se encontró la OT Equipo');

    // Buscar Unidad
    const unidad = await this.unidadRepository.findOne({ where: { id, ot_equipo } });
    if (!unidad) throw new Error('No se encontró la Unidad');

    // Subir a MinIO
    const bucketName = 'oversite';
    const extension = file.originalname.split('.').pop();
    const fileName = `reporte-final/${unidad.code}`;
    const fileUrl = await this.minioService.uploadFile(bucketName, fileName, file.buffer, file.mimetype);

    // Actualizar unidad con la ruta del archivo
    await this.unidadRepository.update(
      { id },
      { src_final_report: fileName + '.' + extension }
    );

    return { message: 'Archivo subido a MinIO correctamente', fileUrl };
  }

  async getUnidadFinalReport(n_order: string, id: number): Promise<{ stream: Readable; contentType: string; fileName: string }> {
  
    const unidad = await this.unidadRepository.findOne({where: {id : id, ot_equipo : {n_order : n_order}}});
    if (!unidad) {
      throw new Error('No se encontro la Unidad');
    }

    console.log(unidad);

    const result = await this.minioService.getObject('oversite', `${unidad.src_final_report}`);
    
    return {
      stream: result.stream,            // Asegúrate que este es Readable
      contentType: result.contentType,
      fileName: `${unidad.src_final_report}`,
    };
  }

  async createUnidadPhoto(
    n_order: string,
    codigo: string,
    files: Express.Multer.File[],
  ) {
    const ot_equipo = await this.otEquipoRepository.findOne({ where: { n_order } });
    if (!ot_equipo) throw new Error('No se encontró la OT Equipo');

    const unidad = await this.unidadRepository.findOne({ where: { code : codigo, ot_equipo } });
    if (!unidad) throw new Error('No se encontró la Unidad');

    const bucketName = 'oversite';

    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const extension = file.originalname.split('.').pop();
        const fileName = `fotos/${unidad.code}/${Date.now()}_${file.originalname}`;
        const fileUrl = await this.minioService.uploadFile(
          bucketName,
          fileName,
          file.buffer,
          file.mimetype,
        );

        const photo = this.photosRepository.create({
          unidad,
          src: `${fileName}.${extension}`,
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

  async getUnidadPhotos(n_order: string, codigo: string) {
    const unidad = await this.unidadRepository.findOne({
      where: { code: codigo, ot_equipo: { n_order } },
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
  
}
