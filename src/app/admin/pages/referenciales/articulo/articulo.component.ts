import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/admin/services/articulo/articulo.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { ProveedorModel } from '../proveedor/proveedor.component';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Buffer } from 'buffer';
import { ImagenBuffer } from 'src/app/admin/utils/image-decode/image-decode.component';

export interface ArticuloModel {
  idarticulo: string;
  descripcion: string;
  precio: number;
  peso: number;
  idproveedor: number;
  estado: string;
  img: ImagenBuffer;
  proveedor: ProveedorModel
}

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})

export class ArticuloComponent implements OnInit {

  constructor(private articuloService: ArticuloService, private messageService: MessageService,private msg: NzMessageService) { }

  editCache: { [key: string]: { edit: boolean; data: ArticuloModel } } = {};
  listOfData: ArticuloModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: ArticuloModel[] = [];

  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  //Para paginacion
  pageSize = 100;
  pageIndex = 1;

  //Modal
  isVisible = false;
  isOkLoading = false;
  selectedArticulo: ArticuloModel | null = null;

  showModal(articulo: ArticuloModel): void {
    this.selectedArticulo = articulo;
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 100);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  startEdit(idarticulo: string): void {
    this.editCache[idarticulo].edit = true;
  }

  cancelEdit(idarticulo: string): void {
    const index = this.listOfData.findIndex(item => item.idarticulo === idarticulo);
    this.editCache[idarticulo] = {
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
    this.listOfDisplayData = this.listOfData.filter((item: ArticuloModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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
  saveEdit(idarticulo: string): void {
    const index = this.listOfData.findIndex(item => item.idarticulo === idarticulo);
    Object.assign(this.listOfData[index], this.editCache[idarticulo].data);
    //console.log(this.listOfData[index]);
    if (this.image) this.listOfData[index].img = this.image;
    let dataSave = this.listOfData[index];

    this.articuloService.updateArticulo(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
    this.listOfData[index]
    this.editCache[idarticulo].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.idarticulo.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(idarticulo: string): void {
    this.listOfData = this.listOfData.filter(d => d.idarticulo !== idarticulo);
    this.listOfDisplayData = this.listOfData;
    this.articuloService.deleteArticulo(idarticulo).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  anulaRow(idarticulo:string):void {
    const index = this.listOfData.findIndex(item => item.idarticulo === idarticulo);
    this.listOfData[index].estado="IN"
    //console.log(this.listOfData[index]);
    this.articuloService.updateArticulo(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  ngOnInit(): void {
    this.getAllArticulo(this.pageIndex);
  }

  getAllArticulo(page: number) {
    this.articuloService.getArticulosPage(page, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: ArticuloModel) => {
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
