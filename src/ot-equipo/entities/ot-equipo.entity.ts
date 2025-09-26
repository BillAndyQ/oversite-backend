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
  
  @Column()
  enterprise: string;

  @Column()
  ruc: string;

  @Column()
  date_service: string;

  @Column()
  address: string;

  @OneToMany(() => Unidad, (unidad) => unidad.ot_equipo, { cascade: true })
  unidades: Unidad[];

  @Column({ enum: Status , nullable: true})
  status: string;

  @Column({ nullable: true })
  subtotal_soles: number;   // base imponible en soles

  @Column({ nullable: true })
  subtotal_dollars: number; // base imponible en dólares

  @Column({ nullable: true })
  total_soles: number;

  @Column({ nullable: true })
  total_dollars: number;

  @Column({ nullable: true })
  total_igv_soles: number;

  @Column({ nullable: true })
  total_igv_dollars: number;

  @Column({ nullable: true })
  type_currency: string;

  @Column({ nullable: true })
  exchange_rate: number;
  
}
