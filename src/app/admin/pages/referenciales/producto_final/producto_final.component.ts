import { Component, OnInit } from '@angular/core';
import { ProductoFinalService } from 'src/app/admin/services/producto_final/producto_final.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { ProveedorModel } from '../proveedor/proveedor.component';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Buffer } from 'buffer';
import { ImagenBuffer } from 'src/app/admin/utils/image-decode/image-decode.component';
import { ArticuloModel } from '../articulo/articulo.component';

export interface RecetaModel {
  idarticulo:number;
  idproducto_final:number;
  receta_estado:string;
  cantidad:number;
  articulo:ArticuloModel;
  estado:string;
}

export interface ProductoFinalModel {
  idproducto_final: number;
  nombre: string;
  descripcion: string;
  costo: number;
  estado: string;
  tipo_iva:number;
  img: ImagenBuffer;
  receta: RecetaModel[]
}

@Component({
  selector: 'app-producto_final',
  templateUrl: './producto_final.component.html',
  styleUrls: ['./producto_final.component.css']
})

export class ProductoFinalComponent implements OnInit {

  constructor(private producto_finalService: ProductoFinalService, private messageService: MessageService,private msg: NzMessageService) { }

  editCache: { [key: string]: { edit: boolean; data: ProductoFinalModel } } = {};
  listOfData: ProductoFinalModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: ProductoFinalModel[] = [];
  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  startEdit(idproducto_final: string): void {
    this.editCache[idproducto_final].edit = true;
  }

  cancelEdit(idproducto_final: number): void {
    const index = this.listOfData.findIndex(item => item.idproducto_final === idproducto_final);
    this.editCache[idproducto_final] = {
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
    this.listOfDisplayData = this.listOfData.filter((item: ProductoFinalModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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
  saveEdit(idproducto_final: number): void {
    const index = this.listOfData.findIndex(item => item.idproducto_final === idproducto_final);
    Object.assign(this.listOfData[index], this.editCache[idproducto_final].data);
    //console.log(this.listOfData[index]);
    if (this.image) this.listOfData[index].img = this.image;
    let dataSave = this.listOfData[index];

    this.producto_finalService.updateProductoFinal(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
    this.listOfData[index]
    this.editCache[idproducto_final].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.idproducto_final.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(idproducto_final: number): void {
    this.listOfData = this.listOfData.filter(d => d.idproducto_final !== idproducto_final);
    this.listOfDisplayData = this.listOfData;
    this.producto_finalService.deleteProductoFinal(idproducto_final).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  anulaRow(idproducto_final:number):void {
    const index = this.listOfData.findIndex(item => item.idproducto_final === idproducto_final);
    //this.listOfData[index].estado="IN"
    //console.log(this.listOfData[index]);
    this.producto_finalService.inactivaProductoFinal(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  ngOnInit(): void {
    this.getAllProductoFinal();
  }

  getAllProductoFinal() {
    this.producto_finalService.getProductoFinal().subscribe({
      next: (response) => {
        if (response) {
          //console.log(response)
          response.body.map((data: ProductoFinalModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
      },
    });
  }


   private getBase64(img: File, callback: (img: string) => void): void {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result!.toString()));
      reader.readAsDataURL(img);
    }
  
  
    decodeImage(imagen:any){
      const base64String = Buffer.from(imagen.data).toString('ascii');
      this.avatarUrl = base64String;
    }

    handleChange(info: { file: NzUploadFile }): void {
      switch (info.file.status) {
        case 'uploading':
          this.loading = true;
          break;
        default:
          this.getBase64(info.file!.originFileObj!, (img: string) => {
            this.loading = false;
            this.avatarUrl = img;
          });
          break;
      }
    }

    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
      new Observable((observer: Observer<boolean>) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.msg.error('Tu archivo no es un jpeg o png!');
          observer.complete();
          return;
        }
        const isLt2M = file.size! / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.msg.error('Image must smaller than 2MB!');
          observer.complete();
          return;
        }
        observer.next(isJpgOrPng && isLt2M);
        observer.complete();
      });

      customUploadReq = (item: NzUploadXHRArgs) => {
        const file = item.file as NzUploadFile;
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Aquí puedes manejar la cadena base64 como necesites
          this.image = base64;
          
          if (item.onSuccess) {
            item.onSuccess({}, item.file, {});
          }
        }
        reader.readAsDataURL(file as unknown as Blob);
        return new Subscription();
      }
}
