import { Certificadoras } from "src/enums/certificadoras.enum";
import { Status } from "src/enums/quotation";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WoPersonnel {
    @PrimaryGeneratedColumn()   
    id: number;
    
    @Column({ nullable: true })
    n_order : string;

    @Column({ nullable: true })
    n_quotation : string;

    @Column({ nullable: true })
    enterprise : string;

    @Column({ nullable: true })
    ruc : string;

    @Column({ nullable: true })
    inspector : string;  

    @Column({ nullable: true })
    mode : string;

    @Column({ nullable: true })
    course : string;

    @Column({ nullable: true })
    names : string;

    @Column({ nullable: true })
    last_names : string;

    @Column({ nullable: true })
    dni : string;

    @Column({ nullable: true })
    date : string;

    @Column({ nullable: true })
    approved : string;

    @Column("enum", { enum: Certificadoras })
    @Column({ nullable: true })
    certifier : string;

    @Column({ nullable: true })
    project : string;

    @Column({ nullable: true })
    instructor : string;

    @Column({ nullable: true })
    n_times : string;

    @Column({ nullable: true })
    comments : string;

    @Column({ enum: Status , nullable: true})
    status: string;

    @Column({ nullable: true })
    src_certificate : string;

    @Column({ nullable: true })
    type_currency : string;

    @Column('decimal', {
      precision: 10,
      scale: 4,
      nullable: true,
      transformer: {
        to: (value: number | null) => value,
        from: (value: string | null) => value ? parseFloat(value) : null,
      },
    })
    exchange_rate: number;
}
