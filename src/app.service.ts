import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTipoCambio() {
    try {
      const response = await axios.get('https://www.sunat.gob.pe/a/txt/tipoCambio.txt');
      const data = response.data.trim();
  
      // Separar por "|"
      const partes = data.split("|").filter((p: string) => p); // elimina valores vacíos
      const [fecha, compra, venta] = partes;
  
      return { fecha, compra, venta };
    } catch (error) {
      console.error("Error al obtener tipo de cambio:", error);
      throw error;
    }
  }
}
