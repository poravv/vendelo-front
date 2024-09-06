import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/admin/utils/message.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InventarioService } from 'src/app/admin/services/inventario/inventario.service';
import { sucursalModel } from '../sucursal/sucursal.component';
import { ArticuloModel } from '../articulo/articulo.component';



export interface DetInventariosModel {
  iddet_inventario: number;
  idinventario: number;
  cantidad: number;
  estado:string;
  fecha_insert:Date;
}

export interface InventarioModel {
  idinventario: number;
  idsucursal: number;
  idarticulo: number;
  cantidad_total: number;
  cantidad_ven: number;
  notificar: number;
  articulo: ArticuloModel;
  sucursal: sucursalModel;
  estado:string;
  det_inventarios: DetInventariosModel[]
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit {

  constructor(private inventarioService: InventarioService, private messageService: MessageService,private msg: NzMessageService) { }

  listOfData: InventarioModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: InventarioModel[] = [];
  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  reset(): void {
    this.searchValue = '';
    this.search();
    //this.descripcion='';
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: InventarioModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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

  deleteRow(idinventario: number): void {
    this.listOfData = this.listOfData.filter(d => d.idinventario !== idinventario);
    this.listOfDisplayData = this.listOfData;
    this.inventarioService.deleteInventario(idinventario).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  anulaRow(idinventario:number):void {
    const index = this.listOfData.findIndex(item => item.idinventario === idinventario);
    this.listOfData[index].estado="IN"
    //console.log(this.listOfData[index]);
    this.inventarioService.updateInventario(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  ngOnInit(): void {
    this.getAllInventario();
  }

  getAllInventario() {
    this.inventarioService.getInventarioSucursal().subscribe({
      next: (response) => {
        //console.log(response);
        if (response) {
          response.body.map((data: InventarioModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
        }
      },
    });
  }


   private getBase64(img: File, callback: (img: string) => void): void {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result!.toString()));
      reader.readAsDataURL(img);
    }
  
}
