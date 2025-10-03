import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OtEquipoService } from './ot-equipo.service';
import { CreateOtEquipoDto } from './dto/create-ot-equipo.dto';
import { UpdateOtEquipoDto } from './dto/update-ot-equipo.dto';
import { CreateUnidadDto } from 'src/unidad/dto/create-unidad.dto';
import { UpdateUnidadDto } from 'src/unidad/dto/update-unidad.dto';

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

}
