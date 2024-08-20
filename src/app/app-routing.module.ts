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

const routes: Routes = [
  { path: '', component: homeComponent },
  { path: 'create-masivo/:type', component: CreateMasivoComponent },
  { path: 'delete-masivo/:type', component: DeleteMasivoComponent },
  {
    path: 'ciudad',
    children: [
      { path: 'list', component: CiudadComponent },
      { path: 'create', component: CiudadCreateComponent }
    ]
  },
  {
    path: 'proveedor',
    children: [
      { path: 'list', component: ProveedorComponent },
      { path: 'create', component: ProveedorCreateComponent }
    ]
  },
  {
    path: 'articulo',
    children: [
      { path: 'list', component: ArticuloComponent },
      { path: 'create', component: ArticuloCreateComponent }
    ]
  },
  {
    path: 'inventario',
    children: [
      { path: 'list', component: InventarioComponent },
      { path: 'create/:idinventario/:idarticulo', component: InventarioCreateComponent }
    ]
  },
  {
    path: 'sucursal',
    children: [
      { path: 'list', component: sucursalComponent },
      { path: 'create', component: sucursalCreateComponent }
    ]
  },
  {
    path: 'cliente',
    children: [
      { path: 'list', component: ClienteComponent },
      { path: 'create', component: ClienteCreateComponent },
      { path: 'edit/:idcliente', component: ClienteCreateComponent }
    ]
  },
  {
    path: 'producto_final',
    children: [
      { path: 'list', component: ProductoFinalComponent },
      { path: 'create', component: ProductoFinalCreateComponent }
    ]
  },
  {
    path: 'venta',
    children: [
      { path: 'list', component: VentaComponent },
      { path: 'create', component: VentaCreateComponent }
    ]
  },
  {
    path: 'total_venta',
    children: [
      { path: 'list', component: VentaTotalComponent },
      { path: 'create', component: VentaCreateComponent }
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
