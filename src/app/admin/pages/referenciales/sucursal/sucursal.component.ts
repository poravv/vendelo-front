import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/admin/utils/message.service';
import { ProveedorModel } from '../proveedor/proveedor.component';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Buffer } from 'buffer';
import { ImagenBuffer } from 'src/app/admin/utils/image-decode/image-decode.component';
import { SucursalService } from 'src/app/admin/services/sucursal/sucursal.service';
import { CiudadModel } from '../ciudad/ciudad.component';
import { CiudadService } from 'src/app/admin/services/ciudad/ciudad.service';

export interface sucursalModel {
  idsucursal: string;
  descripcion: string;
  ruc: string;
  direccion: string;
  idciudad: number;
  estado: string;
  ciudad: CiudadModel;
  numero: number;
}

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css']
})

export class sucursalComponent implements OnInit {

  constructor(private sucursalService: SucursalService, private messageService: MessageService, private ciudadService: CiudadService) { }

  editCache: { [key: string]: { edit: boolean; data: sucursalModel } } = {};
  listOfData: sucursalModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: sucursalModel[] = [];

  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  startEdit(idsucursal: string): void {
    this.editCache[idsucursal].edit = true;
  }

  cancelEdit(idsucursal: string): void {
    const index = this.listOfData.findIndex(item => item.idsucursal === idsucursal);
    this.editCache[idsucursal] = {
      data: { ...this.listOfData[index] },
      edit: false
    }
  }

  reset(): void {
    this.searchValue = '';
    this.search();
    //this.descripcion='';
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: sucursalModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
  }

  searchTotal(search: string) {
    const targetValue: any[] = [];
    this.listOfData.forEach((value: any) => {
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.listOfDisplayData = targetValue;
  }

  /*Ajustar para que el save viaje a la api de persistencia*/
  saveEdit(idsucursal: string): void {
    const index = this.listOfData.findIndex(item => item.idsucursal === idsucursal);
    Object.assign(this.listOfData[index], this.editCache[idsucursal].data);
    //console.log(this.listOfData[index]);
    this.sucursalService.updateSucursal(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
    this.listOfData[index]
    this.editCache[idsucursal].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.idsucursal.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(idsucursal: string): void {
    this.listOfData = this.listOfData.filter(d => d.idsucursal !== idsucursal);
    this.listOfDisplayData = this.listOfData;
    this.sucursalService.deleteSucursal(idsucursal).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  anulaRow(idsucursal:string):void {
    const index = this.listOfData.findIndex(item => item.idsucursal === idsucursal);
    this.listOfData[index].estado="IN"
    //console.log(this.listOfData[index]);
    this.sucursalService.updateSucursal(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  ngOnInit(): void {
    this.getAllSucursal();
  }

  getAllSucursal() {
    this.sucursalService.getSucursal().subscribe({
      next: (response) => {
        //console.log(response)
        if (response) {
          response.body.map((data: sucursalModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
      },
    });
  }

}
