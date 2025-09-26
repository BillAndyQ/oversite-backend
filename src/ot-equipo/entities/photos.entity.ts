import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unidad } from "src/unidad/entities/unidad.entity";

@Entity()
export class Photos {
 
    @PrimaryGeneratedColumn()   
    id: number;

    @Column()
    src: string;

    @ManyToOne(() => Unidad, (unidad) => unidad.photos)
    unidad: Unidad;
}