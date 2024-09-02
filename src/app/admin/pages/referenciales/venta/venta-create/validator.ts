import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const tipoVentaCuotasValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const tipoVenta = formGroup.get('tipo_venta');
  const cuotas = formGroup.get('cuotas');

  if (tipoVenta && tipoVenta.value === 'CR' && (!cuotas || !cuotas.value)) {
    return { cuotasRequired: true };
  }
  return null;
};
