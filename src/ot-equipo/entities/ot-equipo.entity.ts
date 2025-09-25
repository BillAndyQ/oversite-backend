import { Certificadoras } from "src/enums/certificadoras.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photos } from "./photos.entity";

@Entity()
export class OtEquipo {
    @PrimaryGeneratedColumn()   
    id: number;
    
    @Column()
    n_order : string;

    @Column()
    enterprise : string;

    @Column()
    ruc : string;

    @Column()
    date_service: string;

    @Column()
    address: string;

    @Column()
    inspector : string ; 

    @Column("enum", { enum: Certificadoras })
    certifier : string;

    @Column()
    unit_type : string;

    @Column()
    service_type : string;

    @Column()
    plate : string;

    @Column()
    src_certificate : string;

    @Column()
    src_final_report : string;
    
    @Column()
    src_field_report : string;

    @Column()
    service_description : string;

    @Column()
    observations : string;

    @Column()
    comments : string;

    @Column()
    status : boolean

    @OneToMany(() => Photos, (photos) => photos.ot_equipo)
    photos: Photos[];
}
