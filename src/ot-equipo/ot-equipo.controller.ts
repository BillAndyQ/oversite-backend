import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res, UploadedFiles } from '@nestjs/common';
import { OtEquipoService } from './ot-equipo.service';
import { CreateOtEquipoDto } from './dto/create-ot-equipo.dto';
import { UpdateOtEquipoDto } from './dto/update-ot-equipo.dto';
import { CreateUnidadDto } from 'src/unidad/dto/create-unidad.dto';
import { UpdateUnidadDto } from 'src/unidad/dto/update-unidad.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import express from 'express';

@Controller('ot-equipo')
export class OtEquipoController {
  constructor(private readonly otEquipoService: OtEquipoService) {}

  @Post()
  create(@Body() createOtEquipoDto: CreateOtEquipoDto) {
    return this.otEquipoService.create(createOtEquipoDto);
  }

  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.otEquipoService.findAll();
  }

  @Get(':n_order')
  findOne(@Param('n_order') n_order: string) {
    return this.otEquipoService.findOne(n_order);
  }

  @Patch(':n_order')
  update(@Param('n_order') n_order: string, @Body() updateOtEquipoDto: UpdateOtEquipoDto) {
    
    return this.otEquipoService.update(n_order, updateOtEquipoDto);
  }

  @Delete(':n_order')
  remove(@Param('n_order') n_order: string) {
    return this.otEquipoService.remove(n_order);
  }

  @Get(':n_order/unidad')
  findAllUnidad(@Param('n_order') n_order: string) {
    return this.otEquipoService.findAllUnidad(n_order);
  }

  @Post(':n_order/unidad')
  createUnidad(@Param('n_order') n_order: string, @Body() createUnidadDto: CreateUnidadDto) {
    return this.otEquipoService.createUnidad(n_order, createUnidadDto);
  }

  @Delete(':n_order/unidad/:id')
  removeUnidad(@Param('n_order') n_order: string, @Param('id') id: number) {
    return this.otEquipoService.removeUnidad(n_order, id);
  }

  @Patch(':n_order/unidad/:id')
  updateUnidad(@Param('n_order') n_order: string, @Param('id') id: number, @Body() updateUnidadDto: UpdateUnidadDto) {
    return this.otEquipoService.updateUnidad(n_order, id, updateUnidadDto);
  }
  
  @Patch(':n_order/unidad/:id/file/certificate')
  @UseInterceptors(FileInterceptor('src_certificate')) // 'file' es el nombre del campo en FormData
  async updateUnidadFile(
    @Param('n_order') n_order: string,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File, // Aquí recibes el archivo
  ) {
    return this.otEquipoService.updateUnidadFile(n_order, id, file);
  }

  @Get(':n_order/unidad/:id/file/certificate')
  async getUnidadFile(
    @Param('n_order') n_order: string,
    @Param('id') id: number,
    @Res() res: express.Response,
  ) {
    const { stream, contentType, fileName } = await this.otEquipoService.getUnidadFile(n_order, id);
    
    // ✅ Establecer cabeceras correctas
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`, // o "attachment;" si quieres descarga
    });

    // ✅ Enviar el stream al cliente
    stream.pipe(res);
  }
  
@Patch(':n_order/unidad/:id/file/field-report')
  @UseInterceptors(FileInterceptor('src_field_report')) // 'file' es el nombre del campo en FormData
  async updateUnidadFieldReport(
    @Param('n_order') n_order: string,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File, // Aquí recibes el archivo
  ) {
    return this.otEquipoService.updateUnidadFieldReport(n_order, id, file);
  }

  @Get(':n_order/unidad/:id/file/field-report')
  async getUnidadFieldReport(
    @Param('n_order') n_order: string,
    @Param('id') id: number,
    @Res() res: express.Response,
  ) {
    const { stream, contentType, fileName } = await this.otEquipoService.getUnidadFieldReport(n_order, id);
    
    // ✅ Establecer cabeceras correctas
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`, // o "attachment;" si quieres descarga
    });

    // ✅ Enviar el stream al cliente
    stream.pipe(res);
  }

  @Patch(':n_order/unidad/:id/file/final-report')
  @UseInterceptors(FileInterceptor('src_final_report')) // 'file' es el nombre del campo en FormData
  async updateUnidadFinalReport(
    @Param('n_order') n_order: string,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File, // Aquí recibes el archivo
  ) {
    return this.otEquipoService.updateUnidadFinalReport(n_order, id, file);
  }

  @Get(':n_order/unidad/:id/file/final-report')
  async getUnidadFinalReport(
    @Param('n_order') n_order: string,
    @Param('id') id: number,
    @Res() res: express.Response,
  ) {
    const { stream, contentType, fileName } = await this.otEquipoService.getUnidadFinalReport(n_order, id);
    
    // ✅ Establecer cabeceras correctas
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`, // o "attachment;" si quieres descarga
    });

    // ✅ Enviar el stream al cliente
    stream.pipe(res);
  }

// @Get(':n_order/unidad/:id/file/photos')
//   @UseInterceptors(AnyFilesInterceptor())
//   async getUnidadPhotos(
//     @Param('n_order') n_order: string,
//     @Param('id') id: number,
//     @Res() res: express.Response,
//   ) {
//     return this.otEquipoService.getUnidadPhotos(n_order, id);
//   }

  @Get(':n_order/unidad/:codigo/file/photos')
  async getUnidadPhotos(
    @Param('n_order') n_order: string,
    @Param('codigo') codigo: string,
  ) {
    return this.otEquipoService.getUnidadPhotos(n_order, codigo);
  }

  @Post(':n_order/unidad/:codigo/file/photos')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadAnyPhotos(
    @Param('n_order') n_order: string,
    @Param('codigo') codigo: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.otEquipoService.createUnidadPhoto(n_order, codigo, files);
  }

}
