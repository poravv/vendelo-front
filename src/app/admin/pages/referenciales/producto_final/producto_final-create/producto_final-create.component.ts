import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { ProductoFinalService } from 'src/app/admin/services/producto_final/producto_final.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { ProveedorModel } from '../../proveedor/proveedor.component';
import { ProveedorService } from 'src/app/admin/services/proveedor/proveedor.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Buffer } from 'buffer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ArticuloModel } from '../../articulo/articulo.component';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ArticuloService } from 'src/app/admin/services/articulo/articulo.service';

@Component({
  selector: 'app-producto_final-create',
  templateUrl: './producto_final-create.component.html',
  styleUrls: ['./producto_final-create.component.css'],
})
export class ProductoFinalCreateComponent implements OnInit {
  selectedValue = null;
  validateFormReceta: FormGroup;
  proveedores: ProveedorModel[] = [];
  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;
  selectedIndex = 0;
  articulos: ArticuloModel[] = [];
  size: NzSelectSizeType = 'default';
  multipleValue: ArticuloModel[] = [];
  selectedArticulos: any[] = [];


  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private producto_finalService: ProductoFinalService,
    private articuloService: ArticuloService,
    private messageService: MessageService,
    private router: Router,
    private proveedorService: ProveedorService,
    private msg: NzMessageService
  ) {
    this.validateFormReceta = this.fb.group({
      descripcion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      tipo_iva: ['', [Validators.required]],
      img: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      receta: [[], [Validators.required]]
    });
  }

  onArticuloChange(selectedValues: any[]) {
    this.selectedArticulos = selectedValues.map(value => ({
      ...value,
      cantidad: 0
    }));
  }

  ngOnInit(): void {
    this.getAllProveedor();
    this.getAllArticulos();
  }

  getAllArticulos() {
    this.articuloService.getArticulo().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: ArticuloModel) => {
            this.articulos.push(data);
          });
        }
        //console.log(this.ciudades)
      },
    });
  }


  updateCantidad(idarticulo: any, e: any) {
    console.log(e.target.value)
    const cantidad = e.target.value;
    const articuloIndex = this.selectedArticulos.findIndex(a => a.idarticulo === idarticulo);
    if (articuloIndex !== -1) {
      this.selectedArticulos[articuloIndex].cantidad = cantidad;
    }
  }

  submitForm(event: any): void {
    event.preventDefault()

    let valid = false;
    this.validateFormReceta.patchValue({
      receta: this.selectedArticulos
    });

    this.validateFormReceta.get('receta')?.value.forEach((data: any) => {
      if (data.cantidad === 0) {
        valid = true;
      }
    });

    if (valid) {
      this.messageService.createMessage('error', "Cargue cantidades");
      return
    }

    //console.log(this.validateFormReceta.value)

    this.producto_finalService.createProductoFinal(this.validateFormReceta.value).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
        this.validateFormReceta.reset();
      }
    });
    //console.log('submit', this.validateForm.value);
  }

  getAllProveedor() {
    this.proveedorService.getProveedor().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: ProveedorModel) => {
            this.proveedores.push(data);
          });
        }
        //console.log(this.proveedores)
      },
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateFormReceta.reset();
  }

  volver(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigateByUrl('/producto_final/list');
  }

  userNameAsyncValidator: AsyncValidatorFn = (control: AbstractControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value.length <= 2) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }


  decodeImage(imagen: any) {
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
      //this.personaData.photo = base64;
      this.validateFormReceta.patchValue({
        img: base64
      });

      if (item.onSuccess) {
        item.onSuccess({}, item.file, {});
      }
    }
    reader.readAsDataURL(file as unknown as Blob);
    return new Subscription();
  }

  articuloComparator = (articulo: ArticuloModel, other: ArticuloModel): boolean => {
    return articulo && other ? articulo.idarticulo === other.idarticulo : articulo === other;
  };

}
