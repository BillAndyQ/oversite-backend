import { Injectable } from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { OtEquipo } from 'src/ot-equipo/entities/ot-equipo.entity';
import { WoPersonnel } from 'src/wo-personnel/entities/wo-personnel.entity';
import { SequenceService } from 'src/sequence/sequence.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from 'src/enums/quotation';
import { Not, IsNull } from 'typeorm';
import { Unidad } from 'src/unidad/entities/unidad.entity';
import { CreateQuotationUnidadDto } from './dto/create-quotation-unidad.dto';
import { CreateQuotationPersonaDto } from './dto/create-quotation-pesona.dto';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as fs from 'fs';
import { ReadStream } from 'fs';
const PdfPrinter = require('pdfmake');

@Injectable()
export class QuotationService {

  constructor(
    @InjectRepository(OtEquipo)
    private readonly otEquipoRepository: Repository<OtEquipo>,
    @InjectRepository(WoPersonnel)
    private readonly woPersonnelRepository: Repository<WoPersonnel>,
    private readonly sequenceService: SequenceService,
    @InjectRepository(Unidad)
    private readonly unidadRepository: Repository<Unidad>,
  ) {}

  async createQuotationEquipo(createQuotationDto: CreateQuotationDto) {
    
    const quotation = this.otEquipoRepository.create(createQuotationDto);
    const n_quotation = await this.sequenceService.generateNQuotation();
    quotation.n_quotation = n_quotation;
    quotation.status = Status.COTIZACION;
    return await this.otEquipoRepository.save(quotation);
  }

  async createQuotationPersona(createQuotationPersonaDto: CreateQuotationPersonaDto) {
    const quotation = this.woPersonnelRepository.create(createQuotationPersonaDto);
    const n_quotation = await this.sequenceService.generateNQuotation();
    quotation.n_quotation = n_quotation;
    quotation.status = Status.COTIZACION;
    return await this.woPersonnelRepository.save(quotation);
  }

  async findAllEquipo() {
    const quotations = await this.otEquipoRepository.find({where: {n_quotation: Not(IsNull())}});
    if (!quotations) {
      throw new Error('Quotations not found');
    }
    return quotations;
  }

  async findAllPersona() {
    const quotations = await this.woPersonnelRepository.find({where: {n_quotation: Not(IsNull())}});
    if (!quotations) {
      throw new Error('Quotations not found');
    }
    return quotations;
  }

  async findOneEquipo(n_quotation: string) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return quotation;
  }

  async updateEquipo(n_quotation: string, updateQuotationDto: UpdateQuotationDto) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.otEquipoRepository.update({n_quotation : n_quotation}, updateQuotationDto);
  }

  async removeEquipo(n_quotation: string) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.otEquipoRepository.delete({n_quotation : n_quotation});
  }

  async findUnits(n_quotation: string) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}, relations: ['unidades']});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return quotation.unidades;
  }

  async createUnits(n_quotation: string, unidad: CreateQuotationUnidadDto) {
    // Buscar la cotización por código
    const quotation = await this.otEquipoRepository.findOne({
      where: { n_quotation },
    });

    console.log(quotation);
    if (!quotation) {
      console.log('Quotation not found');
      throw new Error('Quotation not found');
    }

    // Crear la unidad con la relación a la cotización
    const unit = this.unidadRepository.create({
      ...unidad,
      ot_equipo : quotation,
    });
    const savedUnit = await this.unidadRepository.save(unit);
    const {ot_equipo, ...rest} = savedUnit;
    return rest;
  }

  async removeUnits(n_quotation: string, id: number) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation, unidades: {id: id}} , relations: ['unidades']});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.unidadRepository.delete({id : id});
  }

  async updateUnit(n_quotation: string, id: number, unidad: CreateQuotationUnidadDto) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation, unidades: {id: id}} , relations: ['unidades']});
    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const unidVerif = await this.unidadRepository.findOne({where: {id: id}});
    if (!unidVerif) {
      throw new Error('Unit not found');
    }

    return this.unidadRepository.update({id : id}, unidad);
  }

  async findOnePersona(n_quotation: string) {
    const quotation = await this.woPersonnelRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return quotation;
  }

  async updatePersona(n_quotation: string, persona: CreateQuotationPersonaDto) {
    const quotation = await this.woPersonnelRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.woPersonnelRepository.update({n_quotation : n_quotation}, persona);
  }

  async removePersona(n_quotation: string) {
    const quotation = await this.woPersonnelRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.woPersonnelRepository.delete({n_quotation : n_quotation});
  }

  async generateOT(n_quotation: string) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}});

    if(!quotation) {
      throw new Error('Quotation not found');
    }
    
    if(quotation.status !== Status.APROBADA) {
      throw new Error('Quotation not approved');
    }

    if(quotation.n_order) {
      throw new Error('Quotation already has an order');
    }

    const n_ot = await this.sequenceService.generateOrder();
    console.log(n_ot);

    return this.otEquipoRepository.update({n_quotation : n_quotation}, {n_order : n_ot});
  }

  async generatePDF(n_quotation: string): Promise<ReadStream>{
    const quotation = await this.otEquipoRepository.findOne({ 
      where: { n_quotation }, 
      relations: ['unidades'] 
    });
  
    if (!quotation) {
      throw new Error('Quotation not found');
    }
  
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold'
      }
    };
  
    const printer = new PdfPrinter(fonts);

    type UnidadKeys = keyof Unidad;


    const unidades = quotation.unidades;
    const currency = quotation.type_currency; // 'USD' o 'PEN'

    // ✅ Base común para todos los casos:
    const columnasMapBase: Partial<Record<UnidadKeys, string>> = {
      unit_type: 'Tipo de Unidad',
      service_type: 'Tipo de Servicio',
    };

    // ✅ Agregamos según moneda:
    let columnasMap: Partial<Record<UnidadKeys, string>> = { ...columnasMapBase };

    if (currency === 'USD') {
      columnasMap.unit_dollars = 'P. Unit ($)' ;
      columnasMap.unit_igv_dollars = 'P. IGV ($)' ;
      columnasMap.unit_subtotal_dollars = 'P. Subtotal ($)' ;
    } else {
      columnasMap.unit_soles = 'P. Unit (S/.)';
      columnasMap.unit_igv_soles = 'P. IGV (S/.)' ;
      columnasMap.unit_subtotal_soles = 'P. Subtotal (S/.)' ;
    }


    // ✅ Extraemos las claves reales (ej: 'unit_type', 'service_type', etc.)
    const keys = Object.keys(columnasMap) as UnidadKeys[];

    // ✅ Primera fila: nombres visibles
    const headerRow = keys.map(key => columnasMap[key] || key);

    // ✅ Filas de datos
    const dataRows = unidades.map(item =>
      keys.map(key => item[key] ?? '')
    );

    // ✅ Construimos el body final
    const body = [
      headerRow,
      ...dataRows
    ];

    const docDefinition = {
      content: [
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: keys.map(() => '*'), // ✅ Una columna por key
            body: body
          }
        }
      ],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 10,
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
  
    const filePath = `out-${n_quotation}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    
    pdfDoc.pipe(writeStream);
    pdfDoc.end();
  
    return await new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(fs.createReadStream(filePath));
      });
      writeStream.on('error', reject);
    });
  }

}
