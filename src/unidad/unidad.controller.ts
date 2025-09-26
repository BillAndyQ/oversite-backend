import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';

@Controller('unidad')
export class UnidadController {
  constructor(private readonly unidadService: UnidadService) {}

  @Post()
  create(@Body() createUnidadDto: CreateUnidadDto) {
    return this.unidadService.create(createUnidadDto);
  }

  @Get()
  findAll(@Query('n_order') n_order: string) {
    return this.unidadService.findAll(n_order);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.unidadService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updateUnidadDto: UpdateUnidadDto) {
    return this.unidadService.update(code, updateUnidadDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.unidadService.remove(code);
  }
}
