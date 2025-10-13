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
    const new_ot = this.otEquipoRepository.update({n_quotation : n_quotation}, {n_order : n_ot});

    const unidades = await this.unidadRepository.find({where: {ot_equipo : {n_quotation : n_quotation}}});

    if(!unidades) {
      throw new Error('Unidades not found');
    }

    Promise.all(unidades.map(async (unidad) => {
      unidad.code = await this.sequenceService.generateCode(n_ot);
      await this.unidadRepository.update({id : unidad.id}, {code : unidad.code});
    }));

    return new_ot;
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
    
        // --- Extracción y Determinación de Datos ---
        const unidades = quotation.unidades;
        const currency = quotation.type_currency; // Moneda base: 'USD' o 'PEN'
        const exchange_rate = quotation.exchange_rate;
        
        // 1. Totales de la Moneda Base
        const symbol = currency === 'USD' ? '$' : 'S/.';
        const final_subtotal = currency === 'USD' ? quotation.subtotal_dollars : quotation.subtotal_soles;
        const final_total_igv = currency === 'USD' ? quotation.total_igv_dollars : quotation.total_igv_soles;
        const final_total = currency === 'USD' ? quotation.total_dollars : quotation.total_soles;
        
        // 2. Datos de la Cabecera
        const enterprise = quotation.enterprise;
        const certifier = quotation.certifier;
        const ruc = quotation.ruc;
        const today = new Date();
        const address = quotation.address;
    
        // Función de formato de moneda
        const formatCurrency = (amount: number) => {
          if (amount === null || amount === undefined) return '';
          return `${symbol} ${amount.toFixed(2)}`;
        };
    
        // --- Mapeo de Columnas para la Tabla de Unidades ---
        const columnasMapBase: Partial<Record<UnidadKeys, string>> = {
          unit_type: 'Tipo de Unidad',
          service_type: 'Tipo de Servicio',
        };
    
        // 3. Definición de las Claves de Precios según la Moneda Base
        const unit_key: UnidadKeys = currency === 'USD' ? 'unit_dollars' : 'unit_soles';
        const igv_key: UnidadKeys = currency === 'USD' ? 'unit_igv_dollars' : 'unit_igv_soles';
        const subtotal_key: UnidadKeys = currency === 'USD' ? 'unit_subtotal_dollars' : 'unit_subtotal_soles';
    
        let columnasMap: Partial<Record<UnidadKeys, string>> = { 
            ...columnasMapBase,
            [unit_key]: `P. Unit (${symbol})`,
            [igv_key]: `P. IGV (${symbol})`,
            [subtotal_key]: `P. Subtotal (${symbol})`,
        };
    
        // ✅ Extraemos las claves reales (ej: 'unit_type', 'service_type', etc.)
        const keys = Object.keys(columnasMap) as UnidadKeys[];
    
        // ✅ Primera fila: nombres visibles
        const headerRow = keys.map(key => ({ text: columnasMap[key] || key, bold: true, alignment: 'center' }));
    
        // ✅ Filas de datos
        const dataRows = unidades.map(item =>
          keys.map(key => {
            const value = item[key];
            // Formatear precios si son números
            if (typeof value === 'number' && key.startsWith('unit_')) {
                return value.toFixed(2);
            }
            return value ?? '';
          })
        );
    
        // ✅ Construimos el body final
        const bodyTableUnidades = [
          headerRow,
          ...dataRows
        ];
    
        // --- Definición del Contenido del PDF (docDefinition) ---
        const docDefinition = {
          content: [
            // 1. Cabecera y Datos de Cotización
            {
              columns: [
                // Columna Izquierda: Datos del Cliente/Empresa
                {
                  width: '50%',
                  stack: [
                    { text: 'Datos del Cliente:', style: 'header', margin: [0, 0, 0, 5] },
                    { text: `Empresa: ${enterprise}`, style: 'data' },
                    { text: `RUC: ${ruc}`, style: 'data' },
                    { text: `Dirección: ${address || 'N/A'}`, style: 'data' },
                    { text: `Certificador/Contacto: ${certifier || 'N/A'}`, style: 'data' },
                  ]
                },
                // Columna Derecha: Datos de la Cotización
                {
                  width: '50%',
                  alignment: 'right',
                  stack: [
                    { text: 'COTIZACIÓN', style: 'title' },
                    { text: `N°: ${n_quotation}`, style: 'quotationNumber', margin: [0, 0, 0, 10] },
                    { text: `Fecha de Emisión: ${today.toLocaleDateString('es-ES')}`, style: 'data' },
                    { text: `Moneda Base: ${currency}`, style: 'data' },
                    { text: `T.C. de Referencia: ${exchange_rate ? exchange_rate.toFixed(4) : 'N/A'}`, style: 'data' },
                  ]
                }
              ],
              margin: [0, 0, 0, 20]
            },
    
            // 2. Título de la Sección de Unidades
            { text: 'Detalle de Servicios/Unidades', style: 'sectionHeader', margin: [0, 10, 0, 5] },
    
            // 3. Tabla de Unidades
            {
              layout: 'lightHorizontalLines',
              table: {
                headerRows: 1,
                widths: keys.map(() => '*'), // Una columna por key
                body: bodyTableUnidades
              },
              margin: [0, 5, 0, 20]
            },
    
            // 4. Totales (SOLO MONEDA BASE)
            {
              columns: [
                { width: '*', text: '' }, 
                {
                  width: 'auto',
                  table: {
                    widths: ['auto', 'auto'],
                    body: [
                      // Subtotal
                      [{ text: 'Subtotal:', bold: true, alignment: 'right' }, formatCurrency(final_subtotal)],
                      // IGV
                      [{ text: `IGV (${symbol}):`, bold: true, alignment: 'right' }, formatCurrency(final_total_igv)],
                      // Total Final (Moneda Base)
                      [{ text: 'TOTAL:', bold: true, alignment: 'right' }, { text: formatCurrency(final_total), bold: true }],
                    ]
                  },
                  layout: 'noBorders'
                }
              ]
            }
          ],
          // 5. Estilos
          defaultStyle: {
            font: 'Helvetica',
            fontSize: 10,
          },
          styles: {
            title: { fontSize: 14, bold: true, decoration: 'underline', margin: [0, 0, 0, 5] },
            quotationNumber: { fontSize: 12, bold: true, color: 'darkblue' },
            header: { fontSize: 11, bold: true },
            sectionHeader: { fontSize: 11, bold: true, decoration: 'underline' },
            data: { fontSize: 10 }
          }
        };
    
        // --- Generación y Retorno del PDF ---
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
