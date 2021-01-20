import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {APIService} from './service/api.service';
import {OnlineOfflineService} from './service/online-offline.service';
import {ProductosDBService, UsuarioWithID} from './service/productos-db.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {catchError} from 'rxjs/operators';
import {ConnectionService} from 'ng-connection-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'angularOffline';
  subscriptions: Subscription[] = [];
  public list: any[] = [];
  public listSQL: any[] = [];
  isOnlineOffline: boolean;
  form: FormGroup;
  public onlineOffline: boolean = navigator.onLine;

  constructor(private api: APIService,
              private fb: FormBuilder,
              private onlineOfflineService: OnlineOfflineService,
              private connectionService: ConnectionService,
              private productosDBService: ProductosDBService) {
    this.iniciarFormulario();
    console.log('onlineOffline', this.onlineOffline);
    this.connectionService.monitor().subscribe(isConnected => {
      console.log('si es true no tiene ', isConnected);
    });
  }


  ngOnInit(): void {
    this.onlineOfflineService.connectionChanged.subscribe(async online => {
      console.log(online);
      console.log('navigator.onLine', navigator.onLine);
      if (navigator.onLine) {
        this.isOnlineOffline = true;
        this.verificarCreadosOffline();
      } else {
        this.isOnlineOffline = false;
        const list = await this.productosDBService.getList();
        this.list = [];
        this.list = [...list];
        // this.listSQL = [...list];
        console.log(list);
      }
    });
  }

  ngOnDestroy(): void {
    /**
     * Unsubscribe all subscriptions to avoid memory leak
     */
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private getList(): void {
    // this.verificarCreadosOffline();
    this.list = [];
    this.api.getListar()
      .pipe(
        catchError(async err => {
          console.error(err.message);
          console.log('Error is handled');
          return await this.productosDBService.getList();
        })
      )
      .subscribe((resp: any) => {
        for (const item of resp) {
          this.setListIndexedDB({id: item.id, nombre: item.nombre, email: item.email, creado: false});
          this.list.push(item);
        }
      });


    // this.api.getListar()
    //   .pipe(
    //     mergeMap((res: any) => {
    //       return map((item: any) => {
    //         const list = {
    //           id: item?.id,
    //           nombre: item?.nombre,
    //           email: item?.email
    //         };
    //         this.setListIndexedDB(list);
    //         return list;
    //       });
    //     })
    //   )
    //   .subscribe( res => {
    //     console.log(res)
    //       this.list = [...this.list, res];
    //   });

  }

  private setListIndexedDB(list: { email: any; nombre: any; id: any, creado: boolean }) {
    return this.productosDBService.setListIndexedDB(list);
  }

  async obetenerDB(): Promise<void> {

    if (!this.isOnlineOffline) {
      window.alert('No tiene conexion para enviar datos');
      return;
    }

    let json: UsuarioWithID [] = await this.productosDBService.getAllListIndexedDB();
    if (json.length > 0) {
      json = json.filter(e => e.creado !== false);
    }

    if (this.isOnlineOffline) {

      this.api.postGuardarResgistro(json).subscribe(resp => {
        console.log(resp);
      });
    }
  }

  async guardarRegistro() {
    if (!this.isOnlineOffline) {
      const list = {
        id: (await this.productosDBService.getAllListIndexedDB()).length + 2,
        nombre: this.form.value.nombre,
        email: this.form.value.email,
        creado: true
      };
      this.setListIndexedDB(list);
      this.list.push(list);
    } else {
      let json = {
        nombre: this.form.value.nombre,
        email: this.form.value.email,
        id: undefined,
        creado: undefined,

      };
      this.api.postGuardarResgistro(json).subscribe(async resp => {
        console.log(resp);
        json.id = (await this.productosDBService.getAllListIndexedDB()).length + 1;
        json.creado = false;
        this.setListIndexedDB(json);
        this.list.push(json);
      });
    }
  }

  private iniciarFormulario() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  private async verificarCreadosOffline() {
    let json: UsuarioWithID [] = await this.productosDBService.getAllListIndexedDB();
    let auxJson = [];
    if (json.length > 0) {
      auxJson = [...json.filter(e => e.creado !== false)];
    }
    console.log(auxJson);
    if(auxJson.length > 0){
      delete auxJson[0].id;
      this.api.postGuardarResgistro(auxJson[0]).subscribe(resp => {
        console.log(resp);
        this.productosDBService.clearRows();
        this.getList();
      });
    }else{
      await this.productosDBService.clearRows();
      this.getList();
    }


  }
}
