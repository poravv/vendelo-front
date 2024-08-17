import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private idsucursal: string='';
  constructor() { }
  

  setIdSucursal(idsucursal: string) {
    this.idsucursal = idsucursal;
  }

  getIdSucursal(): string {
    return this.idsucursal;
  }
}
