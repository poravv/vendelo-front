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
import { ArticuloService } from 'src/app/admin/services/articulo/articulo.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { ProveedorModel } from '../../proveedor/proveedor.component';
import { ProveedorService } from 'src/app/admin/services/proveedor/proveedor.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Buffer } from 'buffer';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-articulo-create',
  templateUrl: './articulo-create.component.html',
  styleUrls: ['./articulo-create.component.css'],
})
export class ArticuloCreateComponent implements OnInit {
  selectedValue = null;
  validateForm: FormGroup;
  proveedores: ProveedorModel[] = [];
  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  constructor(
    private fb: NonNullableFormBuilder,
    private articuloService: ArticuloService,
    private messageService: MessageService,
    private router: Router,
    private proveedorService: ProveedorService,
    private msg: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      descripcion: ['', [Validators.required], [this.userNameAsyncValidator]],
      precio: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      idproveedor: ['', [Validators.required]],
      img: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.getAllProveedor();
  }

  submitForm(): void {
    this.articuloService.createArticulo(this.validateForm.value).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
        this.validateForm.reset();
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
    this.validateForm.reset();
  }

  volver(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigateByUrl('/articulo/list');
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
      this.validateForm.patchValue({
        img: base64
      });

      if (item.onSuccess) {
        item.onSuccess({}, item.file, {});
      }
    }
    reader.readAsDataURL(file as unknown as Blob);
    return new Subscription();
  }

  formatNumber(event: any) {
    const value = event.target.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea dígito
    if (value) {
      event.target.value = new Intl.NumberFormat('es-ES').format(parseInt(value, 10));
    }
  }

}
