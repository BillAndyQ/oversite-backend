import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { CreateQuotationUnidadDto } from './dto/create-quotation-unidad.dto';
import { CreateQuotationPersonaDto } from './dto/create-quotation-pesona.dto';

@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post('equipo')
  createQuotationEquipo(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationService.createQuotationEquipo(createQuotationDto);
  }

  @Post('persona')
  createQuotationPersona(@Body() createQuotationDto: CreateQuotationPersonaDto) {
    return this.quotationService.createQuotationPersona(createQuotationDto);
  }

  @Get('equipo')
  findAllEquipo() {
    return this.quotationService.findAllEquipo();
  }

  @Get('persona')
  findAllPersona() {
    return this.quotationService.findAllPersona();
  }

  @Get('equipo/:n_quotation')
  findOneEquipo(@Param('n_quotation') n_quotation: string) {
    return this.quotationService.findOneEquipo(n_quotation);
  }

  @Post('equipo/:n_quotation/generate-ot')
  generateOT(@Param('n_quotation') n_quotation: string) {
    return this.quotationService.generateOT(n_quotation);
  }
  
  @Get('equipo/:n_quotation/generate-pdf')
  async generatePDF(
    @Param('n_quotation') n_quotation: string,
    @Res() res: any
  ) {
    const fileStream = await this.quotationService.generatePDF(n_quotation);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${n_quotation}.pdf`
    );

    fileStream.pipe(res);
  }


  @Patch('equipo/:n_quotation')
  updateEquipo(@Param('n_quotation') n_quotation: string, @Body() updateQuotationDto: UpdateQuotationDto) {
    return this.quotationService.updateEquipo(n_quotation, updateQuotationDto);
  }

  @Delete('equipo/:n_quotation')
  removeEquipo(@Param('n_quotation') n_quotation: string) {
    return this.quotationService.removeEquipo(n_quotation);
  }

  // UNIDADES
  @Get('equipo/:n_quotation/unidad')
  findUnits(@Param('n_quotation') n_quotation: string) {
    return this.quotationService.findUnits(n_quotation);
  }

  @Post('equipo/:n_quotation/unidad')
  createUnits(@Param('n_quotation') n_quotation: string, @Body() unidad: CreateQuotationUnidadDto  ) {
    console.log(n_quotation);
    console.log(unidad);
    return this.quotationService.createUnits(n_quotation, unidad);
  }

  @Delete('equipo/:n_quotation/unidad/:id')
  removeUnit(@Param('n_quotation') n_quotation: string, @Param('id') id: number) {
    return this.quotationService.removeUnits(n_quotation, id);
  }

  @Patch('equipo/:n_quotation/unidad/:id')
  updateUnit(@Param('n_quotation') n_quotation: string, @Param('id') id: number, @Body() unidad: CreateQuotationUnidadDto) {
    return this.quotationService.updateUnit(n_quotation, id, unidad);
  }

  // PERSONA
  @Get('persona/:n_quotation')
  findOnePersona(@Param('n_quotation') n_quotation: string) {
    return this.quotationService.findOnePersona(n_quotation);
  }

  @Patch('persona/:n_quotation')
  updatePersona(@Param('n_quotation') n_quotation: string, @Body() persona: CreateQuotationPersonaDto) {
    return this.quotationService.updatePersona(n_quotation, persona);
  }

  @Delete('persona/:n_quotation')
  removePersona(@Param('n_quotation') n_quotation: string) {
    return this.quotationService.removePersona(n_quotation);
  }

}
