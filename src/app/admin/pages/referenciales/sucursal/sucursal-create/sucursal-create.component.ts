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
import { MessageService } from 'src/app/admin/utils/message.service';
import { CiudadModel } from '../../ciudad/ciudad.component';
import { CiudadService } from 'src/app/admin/services/ciudad/ciudad.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Buffer } from 'buffer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SucursalService } from 'src/app/admin/services/sucursal/sucursal.service';

@Component({
  selector: 'app-sucursal-create',
  templateUrl: './sucursal-create.component.html',
  styleUrls: ['./sucursal-create.component.css'],
})
export class sucursalCreateComponent implements OnInit{
  selectedValue = null;
  validateForm: FormGroup;
  ciudades: CiudadModel[] = [];
  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  constructor(
    private fb: NonNullableFormBuilder,
    private sucursalService: SucursalService,
    private messageService: MessageService,
    private router: Router,
    private ciudadService: CiudadService,
    private msg: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      descripcion: ['', [Validators.required], [this.userNameAsyncValidator]],
      ruc: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      idciudad: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      numero: [''],
    });
  }
  ngOnInit(): void {
    this.getAllCiudad();
  }

  submitForm(): void {
    this.sucursalService.createSucursal(this.validateForm.value).subscribe((response) => {
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

  getAllCiudad() {
    this.ciudadService.getCiudad().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: CiudadModel) => {
            this.ciudades.push(data);
          });
        }
        //console.log(this.ciudades)
      },
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  volver(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigateByUrl('/sucursal/list');
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
}
