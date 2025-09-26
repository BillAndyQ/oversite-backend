import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity({ name: 'secuencias_cot' })
@Unique(['mes', 'anio'])

export class SequenceCot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  mes: number;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'int', name: 'ultimo_numero', default: 0 })
  lastNumber: number;
}
