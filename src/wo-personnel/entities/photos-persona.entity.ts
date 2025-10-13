import { WoPersonnel } from "./wo-personnel.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PhotosPersona {
    @PrimaryGeneratedColumn()   
    id: number;

    @Column()
    src: string;

    @ManyToOne(() => WoPersonnel, (woPersonnel) => woPersonnel.photos)
    woPersonnel: WoPersonnel;
}
