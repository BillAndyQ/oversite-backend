import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtEquipoModule } from './ot-equipo/ot-equipo.module';
import { User } from './user/entities/user.entity';
import { RefreshToken } from './auth/entities/refresh_token.entity';
import { OtEquipo } from './ot-equipo/entities/ot-equipo.entity';
import { Photos } from './ot-equipo/entities/photos.entity';
import { Role } from './user/entities/role.entity';
import { SequenceModule } from './sequence/sequence.module';
import { Sequence } from './sequence/entities/sequence-ot.entity';
import { SequenceCot } from './sequence/entities/sequence-cot.entity';
import { InvoiceModule } from './invoice/invoice.module';
import { WoPersonnelModule } from './wo-personnel/wo-personnel.module';
import { WoPersonnel } from './wo-personnel/entities/wo-personnel.entity';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { UnidadModule } from './unidad/unidad.module';
import { Unidad } from './unidad/entities/unidad.entity';
import { QuotationModule } from './quotation/quotation.module';
import { Enterprise } from './enterprise/entities/enterprise.entity';
import { CursosModule } from './cursos/cursos.module';
import { Curso } from './cursos/entities/curso.entity';
import { MinioService } from './minio/minio.service';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';
import { PhotosPersona } from './wo-personnel/entities/photos-persona.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,   // <-- Disponible en toda la app sin volver a importarlo}
      envFilePath: '.env.local',
    }),
    AuthModule, UserModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5498,
    username: 'user',
    password: 'password',
    database: 'appdb',
    entities: [User, RefreshToken, OtEquipo, Photos, Role, Sequence, SequenceCot, WoPersonnel, Unidad, Enterprise, Curso, Project, PhotosPersona],
    synchronize: true,
  }), OtEquipoModule, SequenceModule, InvoiceModule, WoPersonnelModule, EnterpriseModule, UnidadModule, QuotationModule, CursosModule, ProjectsModule],
  controllers: [AppController],
  providers: [AppService, MinioService],
})

export class AppModule {}
