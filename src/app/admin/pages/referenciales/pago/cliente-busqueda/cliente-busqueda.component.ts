import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/admin/services/cliente/cliente.service';

@Component({
  selector: 'app-cliente-busqueda',
  templateUrl: './cliente-busqueda.component.html',
  styleUrls: ['./cliente-busqueda.component.css']
})
export class ClienteBusquedaComponent implements OnInit {
  searchForm: FormGroup;
  clientes: any[] = [];

  constructor(private fb: FormBuilder, private clienteService: ClienteService,private router: Router) {
    this.searchForm = this.fb.group({
      searchTerm: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    
    const searchTerm = this.searchForm.value.searchTerm;
    this.clienteService.buscarClientes(searchTerm).subscribe(clientes => {
      //console.log('Entra en onSearch',clientes)
      this.clientes = clientes.body;
    });
  }

  selectCliente(cliente: any): void {
    //console.log('Entra en selectCliente ', cliente);
    this.router.navigate([`/cliente/deudas/${cliente.idventa}`]);
  }
}
