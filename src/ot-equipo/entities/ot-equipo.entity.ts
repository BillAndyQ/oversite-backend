import { Status } from "src/enums/quotation";
import { Unidad } from "src/unidad/entities/unidad.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class OtEquipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  n_order: string;

  @Column({ nullable: true })
  n_service: string;

  @Column({ nullable: true })
  n_quotation: string;

  @Column({ nullable: true })
  certifier: string;
  
  @Column({ nullable: true })
  enterprise: string;

  @Column({ nullable: true })
  ruc: string;

  @Column({ nullable: true })
  date_service: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Unidad, (unidad) => unidad.ot_equipo, { cascade: true })
  unidades: Unidad[];

  @Column({ enum: Status , nullable: true})
  status: string;

  @Column('decimal', {
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => value ? parseFloat(value) : null,
    },
  })
  subtotal_soles: number;   // base imponible en soles

  @Column('decimal', {
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => value ? parseFloat(value) : null,
    },
  })
  subtotal_dollars: number; // base imponible en dólares

  @Column('decimal', {
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => value ? parseFloat(value) : null,
    },
  })
  total_soles: number;

  @Column('decimal', {
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => value ? parseFloat(value) : null,
    },
  })
  total_dollars: number;

  @Column('decimal', {
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => value ? parseFloat(value) : null,
    },
  })
  total_igv_soles: number;

  @Column('decimal', {
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => value ? parseFloat(value) : null,
    },
  })
  total_igv_dollars: number;

  @Column({ nullable: true })
  type_currency: string;

  @Column('decimal', {
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => value ? parseFloat(value) : null,
    },
  })
  exchange_rate: number;

  @Column({ nullable: true })
  currency_converted: boolean;
}
