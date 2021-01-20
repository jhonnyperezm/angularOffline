import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {OnlineOfflineService} from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosDBService {

  private db:any;
  private productosList: Dexie.Table<any> = null;


  constructor(
    private onlineOffline: OnlineOfflineService
  ) {
    this.initIndexedDB();
  }

  private initIndexedDB(){
    this.db =  new Dexie('productos');
    this.db.version(1).stores({
      productos: 'id,nombre,email'
    });

    this.productosList = this.db.table('productos');

  }

  async setListIndexedDB(list) {
    try {
      await this.productosList.add(list);
    } catch (error) {
      console.log('error');
    }
  }

  async getList() {
    return await this.productosList.toArray();
  }

  async getListIndexedDB(id) {
    return await this.db.productos.get(id);
  }
}
