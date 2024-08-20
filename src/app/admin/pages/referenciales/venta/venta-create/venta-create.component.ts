import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { ProveedorModel } from '../../proveedor/proveedor.component';
import { ProveedorService } from 'src/app/admin/services/proveedor/proveedor.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Buffer } from 'buffer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductoFinalService } from 'src/app/admin/services/producto_final/producto_final.service';
import { ProductoFinalModel } from '../../producto_final/producto_final.component';
import { ClienteModel } from '../../cliente/cliente.component';
import { ClienteService } from 'src/app/admin/services/cliente/cliente.service';
import { agregarSeparadorMiles } from 'src/app/admin/utils/separador-miles/agregarSeparadorMiles';
import { VentaService } from 'src/app/admin/services/venta/venta.service';

@Component({
  selector: 'app-venta-create',
  templateUrl: './venta-create.component.html',
  styleUrls: ['./venta-create.component.css'],
})
export class VentaCreateComponent implements OnInit {
  selectedValue = null;
  validateForm: FormGroup;
  saveForm: FormGroup;
  proveedores: ProveedorModel[] = [];
  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;
  ventas: any[] = [];
  tblVentas: any[] = [];
  productosFinales: any[] = [];
  clientes: ClienteModel[] = [];
  modalIsVisible = false;
  value: number = 0;
  vuelto: number = 0;

  separador(valor: number): string {
    return agregarSeparadorMiles(Math.floor(valor)) ?? "";
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private ventaService: VentaService,
    private productoFinalService: ProductoFinalService,
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router,
    private proveedorService: ProveedorService,
    private msg: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      idproducto: [''],
      subtotal: [''],
      producto: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.min(0.00)]]
    });

    this.saveForm = this.fb.group({
      idcliente: ['', Validators.required],
      costo_envio: [0],
      nro_comprobante: [''],
      comision: [''],
      iva_total: [''],
      total: [''],
      detalle: [[], [Validators.required]],
    });

    this.validateForm.get('precio')?.disable();

    this.validateForm.get('producto')?.valueChanges.subscribe((producto: ProductoFinalModel) => {
      if (producto) {
        this.validateForm.patchValue({ precio: producto.costo });
      } else {
        this.validateForm.patchValue({ precio: 0 });
      }
      //this.validateForm.get('precio')?.disable();
    });
  }

  getAllProducto() {
    this.productoFinalService.getProductoVenta().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: any) => {
            this.productosFinales.push(data);
          });
        }
      },
    });
  }

  getAllClientes() {
    this.clienteService.getCliente().subscribe({
      next: (response) => {
        //console.log(response)
        if (response) {
          response.body.map((data: ClienteModel) => {
            this.clientes.push(data);
          });
        }
      },
    });
  }

  ngOnInit(): void {
    this.getAllProducto();
    this.getAllProveedor();
    this.getAllClientes();
  }

  agregarVenta() {
    if (this.validateForm.valid) {

      const { producto, cantidad, precio, descuento } = this.validateForm.value;
      const subtotal = (cantidad * producto.costo) - descuento;
      const iva = (subtotal * producto.tipo_iva) / 100;
      const idproducto_final = producto.idproducto_final;

      console.log(producto)

      //La idea es hacer que en el server se haga el calculo de si existe o no el stock por el producto
      if (producto.obs !== 'STOCK') {
        this.messageService.createMessage('warning', 'No hay stock para este producto');
        return;
      }

      // Verifica existencia de producto
      const productoExistente = this.ventas.some(inv => inv.idproducto_final === idproducto_final);

      if (productoExistente) {
        this.messageService.createMessage('warning', 'El producto ya existe en la lista');
        return;
      }

      this.ventaService.operacionVenta(idproducto_final, 'venta', cantidad).subscribe((response) => {
        console.log(response);
      });

      this.ventas = [...this.ventas, { idproducto_final, producto, cantidad, descuento, precio, subtotal, iva }];
      this.saveForm.patchValue({ detalle: this.ventas });
      this.tblVentas = this.ventas;
      //console.log(this.saveForm.value)
      this.validateForm.reset();
    }
  }

  extraeRow(venta: any) {
    this.ventaService.operacionVenta(venta.idproducto_final, 'retorno', venta.cantidad).subscribe((response) => {
      console.log(response);
    });

    this.ventas = this.ventas.filter(d => d.idproducto_final !== venta.idproducto_final);
    this.tblVentas = this.ventas;
  }

  get totalGeneral(): number {
    return this.ventas.reduce((acc, venta) => acc + venta.subtotal, 0);
  }

  get totalIva(): number {
    return this.ventas.reduce((acc, venta) => acc + venta.iva, 0);
  }

  submitForm(): void {
    console.log(this.totalIva)
    console.log(this.totalGeneral)

    this.saveForm.patchValue({
      iva_total: this.totalIva,
      total: this.totalGeneral,
      nro_comprobante: 0,
      comision: 0
    });

    console.log(this.saveForm.value);

    this.ventaService.createVenta(this.saveForm.value).subscribe((response) => {
      console.log(response);
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
    this.router.navigateByUrl('/venta/list');
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

  showModal(): void {
    this.modalIsVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.modalIsVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.modalIsVisible = false;
  }

  generaVuelto() {
    this.vuelto = this.value - this.totalGeneral;
  }

}
