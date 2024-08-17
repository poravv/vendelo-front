import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { MessageService } from 'src/app/admin/utils/message.service';
import { ArticuloModel } from '../../articulo/articulo.component';
import { ArticuloService } from 'src/app/admin/services/articulo/articulo.service';
import { InventarioService } from 'src/app/admin/services/inventario/inventario.service';

@Component({
  selector: 'app-inventario-create',
  templateUrl: './inventario-create.component.html',
  styleUrls: ['./inventario-create.component.css'],
})
export class InventarioCreateComponent implements OnInit {
  selectedValue = null;
  validateForm: FormGroup;
  articulos: ArticuloModel[] = [];
  idinventario: string = '';
  idarticulo: string = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private inventarioService: InventarioService,
    private messageService: MessageService,
    private router: Router,
    private articuloService: ArticuloService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.idinventario = this.activatedRoute.snapshot.paramMap.get('idinventario') ?? '';
    this.idarticulo = this.activatedRoute.snapshot.paramMap.get('idarticulo') ?? '';

    this.validateForm = this.fb.group({
      idinventario: ['', [Validators.required]],
      idarticulo: ['', [Validators.required]],
      cantidad_total: ['', [Validators.required]],
      notificar: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      articulo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.idinventario) {
      this.validateForm.patchValue({
        idinventario: this.idinventario
      });
    }

    if (this.idarticulo) {
      this.validateForm.patchValue({
        idarticulo: this.idarticulo
      });
      this.asignaArticulo();
    }

    //this.getAllArticulo();
  }

  asignaArticulo(){
    this.articuloService.getArticuloByPk(this.idarticulo).subscribe({
      next: (response) => {
        if (response) {
          this.validateForm.patchValue({
            articulo: response.body.descripcion
          });
        }
      },
    });
    this.validateForm.get('articulo')?.disable();
  }

  submitForm(): void {
    //console.log(this.validateForm.value)
    this.inventarioService.updateInventario(this.validateForm.value).subscribe((response) => {
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

  getAllArticulo() {
    this.articuloService.getArticulo().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: ArticuloModel) => {
            this.articulos.push(data);
          });
        }
      },
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  volver(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigateByUrl('/inventario/list');
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
