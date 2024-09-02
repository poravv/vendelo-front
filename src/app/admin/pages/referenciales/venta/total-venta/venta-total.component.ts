import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/admin/utils/message.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClienteModel } from '../../cliente/cliente.component';
import { VentaService } from 'src/app/admin/services/venta/venta.service';

export interface VentaModel {
  idventa: number;
  idcliente: number;
  idusuario: number;
  nro_comprobante: string;
  fecha: Date;
  iva_total: number;
  total: number;
  estado: string;
  costo_envio: number;
  cliente: ClienteModel
}

@Component({
  selector: 'app-venta-total',
  templateUrl: './venta-total.component.html',
  styleUrls: ['./venta-total.component.css']
})

export class VentaTotalComponent implements OnInit {

  constructor(private ventaService: VentaService, private messageService: MessageService, private msg: NzMessageService) { }

  editCache: { [key: string]: { edit: boolean; data: VentaModel } } = {};
  listOfData: VentaModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: VentaModel[] = [];

  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  reset(): void {
    this.searchValue = '';
    this.search();
    //this.descripcion='';
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: VentaModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
  }

  searchTotal(search: string) {
    const targetValue: any[] = [];
    this.listOfData.forEach((value: any) => {
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (this.checkNestedProperties(value[keys[i]], search)) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.listOfDisplayData = targetValue;
  }

  checkNestedProperties(obj: any, search: string): boolean {
    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        if (obj[key] && this.checkNestedProperties(obj[key], search)) {
          return true;
        }
      }
    } else if (typeof obj === 'string' || typeof obj === 'number') {
      if (obj.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
        return true;
      }
    }
    return false;
  }

  deleteRow(idventa: number): void {
    this.listOfData = this.listOfData.filter(d => d.idventa !== idventa);
    this.listOfDisplayData = this.listOfData;
    this.ventaService.deleteVenta(idventa).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  anulaRow(idventa: number): void {
    const index = this.listOfData.findIndex(item => item.idventa === idventa);
    this.listOfData[index].estado = "IN"
    //console.log(this.listOfData[index]);
    this.ventaService.updateVenta(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  ngOnInit(): void {
    this.getAllVenta();
  }

  getAllVenta() {
    this.ventaService.getVenta().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: VentaModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
        }
      },
    });
  }

}
