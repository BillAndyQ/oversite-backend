import { Certificadoras } from "src/enums/certificadoras.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WoPersonnel {
    @PrimaryGeneratedColumn()   
    id: number;
    
    @Column()
    n_order : string;

    @Column()
    enterprise : string;

    @Column()
    ruc : string;

    @Column()
    inspector : string;  

    @Column()
    mode : string;

    @Column()
    course : string;

    @Column()
    names : string;

    @Column()
    last_names : string;

    @Column()
    dni : string;

    @Column()
    date : string;

    @Column()
    approved : string;

    @Column("enum", { enum: Certificadoras })
    certifier : string;

    @Column()
    project : string;

    @Column()
    instructor : string;

    @Column()
    n_times : string;

    @Column()
    comments : string;

    @Column()
    status : boolean;

    @Column()
    src_certificate : string;
}
