import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuotaService } from 'src/app/admin/services/cuota/cuota.service';
import { MessageService } from 'src/app/admin/utils/message.service';

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

  constructor(private fb: FormBuilder, private router: Router, private cuotaService: CuotaService, private messageService: MessageService) {
    this.pagoForm = this.fb.group({});
    const navigation = this.router.getCurrentNavigation();
    this.state = navigation?.extras.state as { deudas: Deuda[] };
  }

  volver() {
    //this.router.navigate(['../'], { relativeTo: this.route });
    window.history.back();
  }

  ngOnInit(): void {
    console.log(this.state);

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
          console.log('Pagos procesados:', response);
          if (response?.mensaje != 'error') {
            //alert('');
            // Generar ticket para impresión
            // Generar ticket para impresión
            const ticketData = {
              negocio: 'Mauricio Aguilar',
              fecha: new Date().toLocaleDateString(),
              cliente: response.body.venta.cliente.razon_social,
              ruc: response.body.venta.cliente.ruc,
              cuotas: response.body.pagos.map((rs: any) => ({
                cuotaNumero: rs.cuota,
                montoPagado: rs.pagado,
                montoPendiente: rs.monto_pago -rs.pagado,
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
    // Crea una nueva ventana para la impresión
    const printWindow = window.open('', '_blank', 'width=600,height=600');

    if (printWindow) {
      let cuotasHtml = ticketData.cuotas.map((cuota: any) => `
        <p>Cuota Número: ${cuota.cuotaNumero}</p>
        <p>Monto Pagado: ${cuota.montoPagado}</p>
        <p>Monto Pendiente: ${cuota.montoPendiente}</p>
        <p>Vencimiento: ${cuota.vencimiento}</p>
        <hr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Ticket</title>
            <style>
              /* Aquí puedes agregar estilos específicos para la impresión */
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              h2 { text-align: center; }
              p { margin: 5px 0; }
              hr { border: 0; border-top: 1px solid #ccc; margin: 10px 0; }
            </style>
          </head>
          <body>
            <h2>${ticketData.negocio}</h2>
            <p>Fecha: ${ticketData.fecha}</p>
            <p>Cliente: ${ticketData.cliente}</p>
            <p>RUC: ${ticketData.ruc}</p>
            ${cuotasHtml}
          </body>
        </html>
      `);

      printWindow.document.close(); // Cierra el flujo de escritura del documento
      printWindow.focus(); // Asegura que la ventana tenga el foco
      printWindow.print(); // Llama al cuadro de diálogo de impresión
      printWindow.close(); // Cierra la ventana después de imprimir
    }
  }

  formatNumber(event: any) {
    const value = event.target.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea dígito
    if (value) {
      event.target.value = new Intl.NumberFormat('es-ES').format(parseInt(value, 10));
    }
  }

}
