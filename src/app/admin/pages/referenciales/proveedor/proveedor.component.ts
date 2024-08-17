import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/admin/services/proveedor/proveedor.service';
import { MessageService } from 'src/app/admin/utils/message.service';

export interface ProveedorModel {
  idproveedor: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  telefono: string;
  estado: string;
}

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})

export class ProveedorComponent implements OnInit {

  constructor(private proveedorService: ProveedorService, private messageService: MessageService) { }

  editCache: { [key: string]: { edit: boolean; data: ProveedorModel } } = {};
  listOfData: ProveedorModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: ProveedorModel[] = [];

  startEdit(idproveedor: string): void {
    this.editCache[idproveedor].edit = true;
  }

  cancelEdit(idproveedor: string): void {
    const index = this.listOfData.findIndex(item => item.idproveedor === idproveedor);
    this.editCache[idproveedor] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  reset(): void {
    this.searchValue = '';
    this.search();
    //this.razon_social='';
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: ProveedorModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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
  saveEdit(idproveedor: string): void {
    const index = this.listOfData.findIndex(item => item.idproveedor === idproveedor);
    Object.assign(this.listOfData[index], this.editCache[idproveedor].data);
    //console.log(this.listOfData[index]);
    this.proveedorService.updateProveedor(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
    this.listOfData[index]
    this.editCache[idproveedor].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.idproveedor.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(idproveedor: string): void {
    this.listOfData = this.listOfData.filter(d => d.idproveedor !== idproveedor);
    this.listOfDisplayData = this.listOfData;
    this.proveedorService.deleteProveedor(idproveedor).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });

  }

  ngOnInit(): void {
    this.getAllProveedor();
  }

  getAllProveedor() {
    this.proveedorService.getProveedor().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: ProveedorModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
      },
    });
  }

}
