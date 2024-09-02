import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { homeComponent } from './admin/pages/home/home.component';
import { CiudadComponent } from './admin/pages/referenciales/ciudad/ciudad.component';
import { CiudadCreateComponent } from './admin/pages/referenciales/ciudad/ciudad-create/ciudad-create.component';
import { CreateMasivoComponent } from './admin/pages/create-masivo/create-masivo.component';
import { DeleteMasivoComponent } from './admin/pages/delete-masivo/delete-masivo.component';
import { ProveedorComponent } from './admin/pages/referenciales/proveedor/proveedor.component';
import { ProveedorCreateComponent } from './admin/pages/referenciales/proveedor/proveedor-create/proveedor-create.component';
import { ArticuloComponent } from './admin/pages/referenciales/articulo/articulo.component';
import { ArticuloCreateComponent } from './admin/pages/referenciales/articulo/articulo-create/articulo-create.component';
import { InventarioComponent } from './admin/pages/referenciales/inventario/inventario.component';
import { InventarioCreateComponent } from './admin/pages/referenciales/inventario/inventario-create/inventario-create.component';
import { sucursalComponent } from './admin/pages/referenciales/sucursal/sucursal.component';
import { sucursalCreateComponent } from './admin/pages/referenciales/sucursal/sucursal-create/sucursal-create.component';
import { ClienteComponent } from './admin/pages/referenciales/cliente/cliente.component';
import { ClienteCreateComponent } from './admin/pages/referenciales/cliente/cliente-create/cliente-create.component';
import { ProductoFinalComponent } from './admin/pages/referenciales/producto_final/producto_final.component';
import { ProductoFinalCreateComponent } from './admin/pages/referenciales/producto_final/producto_final-create/producto_final-create.component';
import { VentaComponent } from './admin/pages/referenciales/venta/venta.component';
import { VentaCreateComponent } from './admin/pages/referenciales/venta/venta-create/venta-create.component';
import { VentaTotalComponent } from './admin/pages/referenciales/venta/total-venta/venta-total.component';
import { ClienteBusquedaComponent } from './admin/pages/referenciales/pago/cliente-busqueda/cliente-busqueda.component';
import { DeudaListadoComponent } from './admin/pages/referenciales/pago/deuda-listado/deuda-listado.component';
import { PagoComponent } from './admin/pages/referenciales/pago/pago.component';
import { RoleGuard } from './admin/services/auth/role.guard';

const routes: Routes = [
  { path: '', component: homeComponent },
  { path: 'create-masivo/:type', component: CreateMasivoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
  { path: 'delete-masivo/:type', component: DeleteMasivoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
  {
    path: 'ciudad',
    children: [
      { path: 'list', component: CiudadComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
      { path: 'create', component: CiudadCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } }
    ]
  },
  {
    path: 'proveedor',
    children: [
      { path: 'list', component: ProveedorComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
      { path: 'create', component: ProveedorCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } }
    ]
  },
  {
    path: 'articulo',
    children: [
      { path: 'list', component: ArticuloComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
      { path: 'create', component: ArticuloCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } }
    ]
  },
  {
    path: 'inventario',
    children: [
      { path: 'list', component: InventarioComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
      { path: 'create/:idinventario/:idarticulo', component: InventarioCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } }
    ]
  },
  {
    path: 'sucursal',
    children: [
      { path: 'list', component: sucursalComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
      { path: 'create', component: sucursalCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } }
    ]
  },
  {
    path: 'cliente',
    children: [
      { path: 'list', component: ClienteComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: 'create', component: ClienteCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: 'edit/:idcliente', component: ClienteCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      //Componentes para pago
      { path: 'busqueda', component: ClienteBusquedaComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: 'deudas/:id', component: DeudaListadoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: 'pago', component: PagoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } }
    ]
  },
  {
    path: 'producto_final',
    children: [
      { path: 'list', component: ProductoFinalComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } },
      { path: 'create', component: ProductoFinalCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'stock'] } }
    ]
  },
  {
    path: 'venta',
    children: [
      { path: 'list', component: VentaComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: 'create', component: VentaCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } }
    ]
  },
  {
    path: 'total_venta',
    children: [
      { path: 'list', component: VentaTotalComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: 'create', component: VentaCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } }
    ]

  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
