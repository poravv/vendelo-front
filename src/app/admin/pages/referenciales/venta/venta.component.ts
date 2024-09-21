import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/admin/utils/message.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClienteModel } from '../cliente/cliente.component';
import { VentaService } from 'src/app/admin/services/venta/venta.service';
import { Deuda } from '../pago/pago.component';
import { TicketService } from 'src/app/admin/utils/ticket/ticket.service';
import { agregarSeparadorMiles } from 'src/app/admin/utils/separador-miles/agregarSeparadorMiles';
import { NumeroALetrasService } from 'src/app/admin/utils/numero-a-letras/numero-a-letras.service';
import { datos_negocio } from 'src/assets/datos-negocio';

export interface VentaModel {
  idventa: number;
  idcliente: number;
  idusuario: number;
  nro_comprobante: string;
  fecha: Date;
  iva_total: number;
  total: number;
  estado: string;
  costo_envio: number;
  cliente: ClienteModel;
  tipo_venta: string;
  cuota: number;
  retiro: string;
  pagos: Deuda[];
  det_venta: any[];
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})

export class VentaComponent implements OnInit {
  
  negocio = datos_negocio;

  constructor(
    private ventaService: VentaService,
    private messageService: MessageService,
    private msg: NzMessageService,
    private ticketService: TicketService,
    private numeroALetrasService: NumeroALetrasService
  ) { }

  editCache: { [key: string]: { edit: boolean; data: VentaModel } } = {};
  listOfData: VentaModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: VentaModel[] = [];

  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  expandSet = new Set<number>();
  expandSetDetail = new Set<number>();

  onExpandChangeDetail(id: number, checked: boolean): void {
    if (checked) {
      this.expandSetDetail.add(id);
    } else {
      this.expandSetDetail.delete(id);
    }
  }

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
    this.listOfDisplayData = this.listOfData.filter((item: VentaModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
  }

  searchTotal(search: string) {
    const targetValue: any[] = [];
    this.listOfData.forEach((value: any) => {
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (this.checkNestedProperties(value[keys[i]], search)) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.listOfDisplayData = targetValue;
  }

  checkNestedProperties(obj: any, search: string): boolean {
    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        if (obj[key] && this.checkNestedProperties(obj[key], search)) {
          return true;
        }
      }
    } else if (typeof obj === 'string' || typeof obj === 'number') {
      if (obj.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
        return true;
      }
    }
    return false;
  }

  deleteRow(idventa: number): void {
    this.listOfData = this.listOfData.filter(d => d.idventa !== idventa);
    this.listOfDisplayData = this.listOfData;
    this.ventaService.deleteVenta(idventa).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  generaTicket(data: any) {

    //console.log('----->',data)

    if(data.tipo_venta=="CR"){
      const ticketData = {
        negocio: this.negocio.negocio,
        duenho: this.negocio.propietario,
        direccion: this.negocio.direccion,
        telefono: this.negocio.telefono,
        email: this.negocio.email,
        numeroPedido: data.idventa,
        correo_cli: data.cliente.correo,
        direccion_cli: data.cliente.direccion,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        cliente: data.cliente.razon_social,
        ruc: data.cliente.ruc,
        det_venta: data.det_venta,
        totalIva: agregarSeparadorMiles(data.iva_total),
        delivery: agregarSeparadorMiles(Number(data.costo_envio)),
        total: agregarSeparadorMiles(data.total),
        totalGeneral: agregarSeparadorMiles(Number(data.total)),
        situacionPedido: 'Pendiente',
        numLetra: this.convertirNumeroALetras((Number(data.total))),
        cuotas: data.pagos.map((rs: any) => ({
          cuotaNumero: rs.cuota,
          montoPagado: agregarSeparadorMiles(rs.pagado??0),
          montoPendiente: agregarSeparadorMiles(rs.monto_pago - rs.pagado),
          total: agregarSeparadorMiles(rs.monto_pago??0),
          vencimiento: rs.vencimiento
        }))
      };

      this.ticketService.mostrarTicketVentaCredito(ticketData);

    }else{
      const ticketData = {
        negocio: this.negocio.negocio,
        duenho: this.negocio.propietario,
        direccion: this.negocio.direccion,
        telefono: this.negocio.telefono,
        email: this.negocio.email,
        numeroPedido: data.idventa,
        correo_cli: data.cliente.correo,
        direccion_cli: data.cliente.direccion,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        cliente: data.cliente.razon_social,
        ruc: data.cliente.ruc,
        det_venta: data.det_venta,
        totalIva: agregarSeparadorMiles(data.iva_total),
        delivery: agregarSeparadorMiles(Number(data.costo_envio)),
        total: agregarSeparadorMiles(data.total),
        totalGeneral: agregarSeparadorMiles(Number(data.total)),
        situacionPedido: 'Pendiente',
        numLetra: this.convertirNumeroALetras((Number(data.total)))
      };
      this.ticketService.mostrarTicketVenta(ticketData);
    }

    



   
  }

  anulaRow(idventa: number): void {
    const index = this.listOfData.findIndex(item => item.idventa === idventa);
    this.listOfData[index].estado = "IN"
    //console.log(this.listOfData[index]);
    this.ventaService.updateVenta(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  convertirNumeroALetras(num: any): string {
    return this.numeroALetrasService.NumeroALetras(Number(num));
  }


  ngOnInit(): void {
    this.getAllVenta();
  }

  getAllVenta() {
    this.ventaService.getVentaUsuario().subscribe({
      next: (response) => {
        if (response) {

          console.log(response)

          response.body.map((data: VentaModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
        }
      },
    });
  }

}
