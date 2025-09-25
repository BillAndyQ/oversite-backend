import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WoPersonnelService } from './wo-personnel.service';
import { CreateWoPersonnelDto } from './dto/create-wo-personnel.dto';
import { UpdateWoPersonnelDto } from './dto/update-wo-personnel.dto';

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
}
