import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { WoPersonnelService } from './wo-personnel.service';
import { CreateWoPersonnelDto } from './dto/create-wo-personnel.dto';
import { UpdateWoPersonnelDto } from './dto/update-wo-personnel.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Res } from '@nestjs/common';
import express from 'express';

@Controller('ot-persona')
export class WoPersonnelController {
  constructor(private readonly woPersonnelService: WoPersonnelService) {}

  @Post()
  create(@Body() createWoPersonnelDto: CreateWoPersonnelDto) {
    return this.woPersonnelService.create(createWoPersonnelDto);
  }

  @Get()
  findAll() {
    return this.woPersonnelService.findAll();
  }

  @Get(':n_order')
  findOne(@Param('n_order') n_order: string) {
    return this.woPersonnelService.findOne(n_order);
  }

  @Patch(':n_order')
  update(@Param('n_order') n_order: string, @Body() updateWoPersonnelDto: UpdateWoPersonnelDto) {
    return this.woPersonnelService.update(n_order, updateWoPersonnelDto);
  }

  @Delete(':n_order')
  remove(@Param('n_order') n_order: string) {
    return this.woPersonnelService.remove(n_order);
  }


  @Patch(':n_order/file/certificate')
  @UseInterceptors(FileInterceptor('src_certificate')) // 'file' es el nombre del campo en FormData
  async updateCertificate(
    @Param('n_order') n_order: string,
    @UploadedFile() file: Express.Multer.File, // Aquí recibes el archivo
  ) {
    return this.woPersonnelService.uploadCertificate(n_order, file);
  }
  
  @Get(':n_order/file/certificate')
  async getCertificate(
    @Param('n_order') n_order: string,
    @Res() res: express.Response,
  ) {
    const { stream, contentType, fileName } = await this.woPersonnelService.getCertificate(n_order);
    
    // Establecer cabeceras correctas
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`, // o "attachment;" si quieres descarga
    });

    // Enviar el stream al cliente
    stream.pipe(res);
  }

  @Patch(':n_order/file/field-report')
  @UseInterceptors(FileInterceptor('src_field_report')) // 'file' es el nombre del campo en FormData
  async updateFieldReport(
    @Param('n_order') n_order: string,
    @UploadedFile() file: Express.Multer.File,                // Aquí recibes el archivo
  ) {
    return this.woPersonnelService.uploadFieldReport(n_order, file);
  }
  
  @Get(':n_order/file/field-report')
  async getFieldReport(
    @Param('n_order') n_order: string,
    @Res() res: express.Response,
  ) {
    const { stream, contentType, fileName } = await this.woPersonnelService.getFieldReport(n_order);
    
    // Establecer cabeceras correctas
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`, // o "attachment;" si quieres descarga
    });

    // Enviar el stream al cliente
    stream.pipe(res);
  }

  @Get(':n_order/file/photos')
  async getPhotos(
    @Param('n_order') n_order: string,
  ) {
    return this.woPersonnelService.getPhotos(n_order);
  }

  @Post(':n_order/file/photos')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadAnyPhotos(
    @Param('n_order') n_order: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.woPersonnelService.createPhoto(n_order, files);
  }

}
