
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Curso {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    course: string;
}
