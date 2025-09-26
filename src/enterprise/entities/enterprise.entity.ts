import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Enterprise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    razon_social: string;

    @Column()
    ruc: string;

    @Column({ nullable: true })
    direccion: string;

    @Column({ nullable: true })
    telefono: string;

    @Column({ nullable: true })
    email: string;
}
