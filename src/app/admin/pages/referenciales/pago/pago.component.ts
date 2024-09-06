import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuotaService } from 'src/app/admin/services/cuota/cuota.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { agregarSeparadorMiles } from 'src/app/admin/utils/separador-miles/agregarSeparadorMiles';
import { TicketService } from 'src/app/admin/utils/ticket/ticket.service';
import { datos_negocio } from 'src/assets/datos-negocio';

export interface Deuda {
  idpago: number;
  vencimiento: string;
  fecha_pago: string;
  monto_pago?: number;
  idventa: number;
  cuota: number;
  monto_mora: number;
  estado: string;
  selected?: boolean;
  pagado?: number;
  vuelto?: number;
}

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pagoForm: FormGroup;
  deudasSeleccionadas: Deuda[] = [];
  state!: any;
  negocio = datos_negocio;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cuotaService: CuotaService,
    private messageService: MessageService,
    private ticketService: TicketService
  ) {
    this.pagoForm = this.fb.group({});
    const navigation = this.router.getCurrentNavigation();
    this.state = navigation?.extras.state as { deudas: Deuda[] };
  }

  volver() {
    //this.router.navigate(['../'], { relativeTo: this.route });
    window.history.back();
  }

  ngOnInit(): void {
    if (this.state) {
      this.deudasSeleccionadas = this.state.deudas;

      this.deudasSeleccionadas.forEach(deuda => {
        this.pagoForm.addControl(`monto_pago_${deuda.idpago}`, this.fb.control('', [Validators.required, Validators.min(0)]));
      });
    } else {
      console.error('No se pudo obtener el estado de navegación');
    }
  }

  calcularVuelto(deuda: Deuda): void {
    const montoPago = this.pagoForm.get(`monto_pago_${deuda.idpago}`)?.value || 0;
    const montoAPagar = (deuda.monto_pago ?? 0) - (deuda.pagado ?? 0);
    deuda.vuelto = montoPago > montoAPagar ? montoPago - montoAPagar : 0;
  }

  onSubmit(): void {
    if (this.pagoForm.valid) {
      const pagos = this.deudasSeleccionadas.map(deuda => {
        const montoIngresado = this.pagoForm.get(`monto_pago_${deuda.idpago}`)?.value || 0;
        const montoAPagar = (deuda.monto_pago ?? 0) - (deuda.pagado ?? 0);
        const montoFinal = Math.min(montoIngresado, montoAPagar);
        return {
          idpago: deuda.idpago,
          pagado: montoFinal
        };
      });

      this.cuotaService.procesarPagos(pagos).subscribe(
        response => {
          //console.log('Pagos procesados:', response);
          if (response?.mensaje != 'error') {

            //alert('');
            // Generar ticket para impresión
            // Generar ticket para impresión

            const ticketData = {

              negocio: this.negocio.negocio,
              duenho: this.negocio.propietario,
              direccion: this.negocio.direccion,
              telefono: this.negocio.telefono,
              email: this.negocio.email,
              numeroPedido: response.body.venta.idventa,
              correo_cli: response.body.venta.cliente.correo,
              direccion_cli: response.body.venta.cliente.direccion,
              fecha: new Date().toLocaleDateString(),
              hora: new Date().toLocaleTimeString(),
              cliente: response.body.venta.cliente.razon_social,
              ruc: response.body.venta.cliente.ruc,
              cuotas: response.body.pagos.map((rs: any) => ({
                cuotaNumero: rs.cuota,
                montoPagado: agregarSeparadorMiles(rs.pagado),
                montoPendiente: agregarSeparadorMiles(rs.monto_pago - rs.pagado),
                total: agregarSeparadorMiles(rs.monto_pago),
                vencimiento: rs.vencimiento
              }))
            };

            this.mostrarTicket(ticketData);

            this.messageService.createMessage('success', 'Pagos procesados con éxito');
            this.volver();
          } else {
            this.messageService.createMessage('error', 'Hubo un error al procesar los pagos. Por favor, inténtalo de nuevo.');
          }

        },
        error => {
          this.messageService.createMessage('error', 'Hubo un error al procesar los pagos. Por favor, inténtalo de nuevo.');
          console.error('Error al procesar los pagos:', error);
          //alert('');
        }
      );
    } else {
      this.messageService.createMessage('warning', 'Por favor, completa todos los campos requeridos.');
      //alert('');
    }
  }

  mostrarTicket(ticketData: any) {
    this.ticketService.mostrarTicketPago(ticketData);
  }

  formatNumber(event: any) {
    const value = event.target.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea dígito
    if (value) {
      event.target.value = new Intl.NumberFormat('es-ES').format(parseInt(value, 10));
    }
  }
  

}
