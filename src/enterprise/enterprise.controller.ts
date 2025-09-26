import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Post()
  create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    return this.enterpriseService.create(createEnterpriseDto);
  }

  @Get()
  findAll() {
    return this.enterpriseService.findAll();
  }

  @Get(':ruc')
  findOne(@Param('ruc') ruc: string) {
    return this.enterpriseService.findOne(ruc);
  }

  @Patch(':ruc')
  update(@Param('ruc') ruc: string, @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
    return this.enterpriseService.update(ruc, updateEnterpriseDto);
  }
  
  @Delete(':ruc')
  remove(@Param('ruc') ruc: string) {
    return this.enterpriseService.remove(ruc);
  }
}
