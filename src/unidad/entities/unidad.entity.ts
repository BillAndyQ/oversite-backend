import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OtEquipo } from "src/ot-equipo/entities/ot-equipo.entity";
import { Photos } from "src/ot-equipo/entities/photos.entity";
import { Certificadoras } from "src/enums/certificadoras.enum";

@Entity()
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  inspector: string;

  @Column("enum", { enum: Certificadoras })
  certifier: string;

  @Column()
  unit_type: string;

  @Column()
  service_type: string; // NOT, IZAJE, Mantto Industrial, Faraday, etc.

  @Column()
  plate: string;

  @Column()
  src_certificate: string; // PDF certificado

  @Column()
  src_final_report: string; // PDF informe final

  @Column()
  src_field_report: string; // PDF informe de campo

  @OneToMany(() => Photos, (photos) => photos.unidad, { cascade: true })
  photos: Photos[];

  @Column()
  service_description: string;

  @Column()
  observations: string;

  @Column()
  comments: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => OtEquipo, (ot) => ot.unidades)
  ot_equipo: OtEquipo;

  @Column({ nullable: true })
  unit_soles: number;

  @Column({ nullable: true })
  unit_dollars: number;

  @Column({ nullable: true })
  unit_igv_soles: number;

  @Column({ nullable: true })
  unit_igv_dollars: number;

  @Column({ nullable: true })
  unit_subtotal_soles: number;

  @Column({ nullable: true })
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
