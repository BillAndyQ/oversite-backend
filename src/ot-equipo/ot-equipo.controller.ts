import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OtEquipoService } from './ot-equipo.service';
import { CreateOtEquipoDto } from './dto/create-ot-equipo.dto';
import { UpdateOtEquipoDto } from './dto/update-ot-equipo.dto';
import { AuthGuard } from 'src/auth/auht.guard';

@Controller('ot-equipo')
export class OtEquipoController {
  constructor(private readonly otEquipoService: OtEquipoService) {}

  @Post()
  create(@Body() createOtEquipoDto: CreateOtEquipoDto) {
    return this.otEquipoService.create(createOtEquipoDto);
  }

  @UseGuards(AuthGuard)
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
}
