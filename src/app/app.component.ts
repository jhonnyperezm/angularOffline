import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {APIService} from './service/api.service';
import {OnlineOfflineService} from './service/online-offline.service';
import {ProductosDBService} from './service/productos-db.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


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
  form: FormGroup;

  constructor(private api: APIService,
              private fb: FormBuilder,
              private onlineOfflineService: OnlineOfflineService,
              private productosDBService: ProductosDBService) {
    this.iniciarFormulario();
  }


  ngOnInit(): void {
    this.onlineOfflineService.connectionChanged.subscribe(async online => {
      console.log(online);
      if (online) {
        this.getList();
      } else {
        const list = await this.productosDBService.getList();
        this.list = [];
        this.list.push(list);
        this.listSQL.push(list);
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

    this.api.getListar().subscribe((resp: any) => {
      for (const item of resp) {
        this.setListIndexedDB({id: item.id, nombre: item.nombre, email: item.email});
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

  private setListIndexedDB(list: { email: any; nombre: any; id: any }) {
    return this.productosDBService.setListIndexedDB(list);
  }

  async obetenerDB() {
    let json: any = await this.productosDBService.getListIndexedDB(this.list.length + 1);
    delete json.id;
    this.api.postGuardarResgistro(json).subscribe(resp => {
      console.log(resp);
    });
  }

  guardarRegistro() {
    this.onlineOfflineService.connectionChanged.subscribe( online => {
      const list = {
        id: this.list.length + 1,
        nombre: this.form.value.nombre,
        email: this.form.value.email
      };
      this.setListIndexedDB(list);
      this.listSQL.push(list);
    });
  }

  private iniciarFormulario() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required]
    });
  }
}
