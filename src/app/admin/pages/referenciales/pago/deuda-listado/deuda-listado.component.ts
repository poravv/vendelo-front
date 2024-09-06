import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuotaService } from 'src/app/admin/services/cuota/cuota.service';


@Component({
  selector: 'app-deuda-listado',
  templateUrl: './deuda-listado.component.html',
  styleUrls: ['./deuda-listado.component.css']
})
export class DeudaListadoComponent implements OnInit {
  deudas: any[] = [];

  constructor(private route: ActivatedRoute, private cuotaService: CuotaService,private router: Router) {}

  ngOnInit(): void {
    const idventa = this.route.snapshot.paramMap.get('id');
    
    if(idventa)
    this.cuotaService.obtenerDeudas(idventa).subscribe(deudas => {
      this.deudas = deudas.body;
    });
  }

  irAPagos(): void {
    const deudasSeleccionadas = this.deudas.filter(deuda => deuda.selected);
    //console.log(deudasSeleccionadas)
    this.router.navigate(['/cliente/pago'], { state: { deudas: deudasSeleccionadas } });
    // Aquí puedes redirigir al componente de pagos con las deudas seleccionadas
  }
}
