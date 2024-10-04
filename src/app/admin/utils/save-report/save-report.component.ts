import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { reportesService } from '../../services/reportes/reportes.service';
import { ExportsService } from '../exports.service';

@Component({
  selector: 'app-save-report',
  templateUrl: './save-report.component.html',
  styleUrls: ['./save-report.component.css']
})
export class SavedReportComponent implements OnInit {
  savedReportForm: FormGroup;
  reports: any[] = [];
  reportResult: any;
  today: string = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  columns: string[] = [];

  constructor(private fb: FormBuilder, private reportService: reportesService,private exportsService:ExportsService) {
    this.savedReportForm = this.fb.group({
      reportId: [''],
      fromDate: [''],
      toDate: [this.today]
    });
  }

  ngOnInit(): void {
    this.loadReports()
  }

  loadReports() {
    this.reportService.getReports().subscribe(response => {
      this.reports = response.data;
    });
  }

  executeSavedReport() {
    const { reportId, fromDate, toDate } = this.savedReportForm.value;
    this.reportService.executeSavedReport(reportId, fromDate, toDate).subscribe(result => {
      this.reportResult = result.data.map((item: any) => {
        // Convierte los valores de las columnas específicas a enteros
        const columnsToConvert = ['COSTO', 'VENTA','GANANCIA', 'DELIVERY', 'GASTO', 'INVERSION', 'SUBTOTAL', 'TOTAL'];
  
        for (let key in item) {
          if (columnsToConvert.includes(key.toUpperCase()) && typeof item[key] === 'string') {
            item[key] = Math.floor(parseFloat(item[key])); // Usa Math.round(parseFloat(item[key])) si prefieres redondear
          }
        }
        return item;
      });
      if (result.data.length > 0) {
        this.columns = Object.keys(result.data[0]);
      }
    });
  }
  

  onExportExcel(){
    this.exportsService.exportToExcel(this.reportResult,'Reporte')
  }
}
