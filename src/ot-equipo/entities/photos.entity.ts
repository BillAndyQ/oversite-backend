import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OtEquipo } from "./ot-equipo.entity";

@Entity()
export class Photos {
 
    @PrimaryGeneratedColumn()   
    id: number;

    @Column()
    src: string;

    @ManyToOne(() => OtEquipo, (ot_equipo) => ot_equipo.photos)
    ot_equipo: OtEquipo;
}