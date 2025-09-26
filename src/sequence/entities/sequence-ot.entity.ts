import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'secuencias_ot' })
@Unique(['mes', 'anio'])

export class Sequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  mes: number;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'int', name: 'ultimo_numero', default: 0 })
  lastNumber: number;
}
