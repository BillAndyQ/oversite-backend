import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OtEquipo } from "src/ot-equipo/entities/ot-equipo.entity";
import { Photos } from "src/ot-equipo/entities/photos.entity";
import { Certificadoras } from "src/enums/certificadoras.enum";

const optionsDecimal = {
  precision: 10,
  scale: 2,
  nullable: true,
  transformer: {
    to: (value: number | null) => value,
    from: (value: string | null) => value ? parseFloat(value) : null,
  },
}

@Entity()
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  inspector: string;

  @Column("enum", { enum: Certificadoras, nullable: true })
  certifier: string;

  @Column()
  unit_type: string;

  @Column()
  service_type: string; // NOT, IZAJE, Mantto Industrial, Faraday, etc.

  @Column({ nullable: true })
  plate: string;

  @Column({ nullable: true })
  src_certificate: string; // PDF certificado

  @Column({ nullable: true })
  src_final_report: string; // PDF informe final

  @Column({ nullable: true })
  src_field_report: string; // PDF informe de campo

  @OneToMany(() => Photos, (photos) => photos.unidad, { cascade: true })
  photos: Photos[];

  @Column({ nullable: true })
  service_description: string;

  @Column({ nullable: true })
  observations: string;

  @Column({ nullable: true })
  comments: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => OtEquipo, (ot) => ot.unidades)
  ot_equipo: OtEquipo;

  @Column('decimal', optionsDecimal)
  unit_soles: number;

  @Column('decimal', optionsDecimal)
  unit_dollars: number;

  @Column('decimal', optionsDecimal)
  unit_igv_soles: number;

  @Column('decimal', optionsDecimal)
  unit_igv_dollars: number;

  @Column('decimal', optionsDecimal)
  unit_subtotal_soles: number;

  @Column('decimal', optionsDecimal)
  unit_subtotal_dollars: number;

  @Column({ nullable: true })
  unit_type_currency: string;

  @Column({ nullable: true })
  unit_exchange_rate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
