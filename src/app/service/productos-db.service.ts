import {Injectable} from '@angular/core';
import Dexie from 'dexie';
import {OnlineOfflineService} from './online-offline.service';

export interface Usuario {
  nombre: string;
  email: string;
  creado: boolean;
}

export interface UsuarioWithID extends Usuario {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosDBService {

  private db: any;
  // private productosList: Dexie.Table<any> = null;
  productosList: Dexie.Table<UsuarioWithID, number>;


  constructor(
    private onlineOffline: OnlineOfflineService
  ) {
    this.initIndexedDB();
  }

  private initIndexedDB() {
    this.db = new Dexie('productos');
    this.db.version(1).stores({
      productos: 'id,nombre,email,creado'
    });

    this.productosList = this.db.table('productos');

  }

  // tslint:disable-next-line:typedef
  async setListIndexedDB(list) {
    try {
      await this.productosList.add(list);
    } catch (error) {
      console.log('error', error.message);
    }
  }

  async getList() {
    return await this.productosList.toArray();
  }

  async getListIndexedDB(id) {
    return await this.db.productos.get(id);
  }

  async getAllListIndexedDB() {
    return await this.db.productos.toArray();
  }

  async clearRows(){
    return this.db.productos.clear();
  }
}
