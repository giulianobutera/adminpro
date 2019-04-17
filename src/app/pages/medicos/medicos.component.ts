import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/service.index';
import { Hospital } from 'src/app/models/hospital.model';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  cargando: boolean;
  totalRegistros: number = 0;
  // Bandera para controlar el estado de los botones anterior y siguiente
  flagBefNext: boolean = true;

  constructor( public _medicoService: MedicoService ) {
  }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos(this.desde)
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.medicos = resp.medicos;
        this.cargando = false;
      });
  }

  getNameHospital(hospital: Hospital): string {
    return hospital.nombre;
  }

  buscarMedico(termino: string) {
    // Al buscar un usuario la paginación se rompe, por lo que ponemos en disabled los botones anterior y siguiente
    this.flagBefNext = false;

    if (termino.length <= 0) {
      this.cargarMedicos();
      // si termino.length es 0 significa que ya no se está buscando un usuario, se reactivan los botones
      this.flagBefNext = true;
      return;
    }

    this.cargando = true;

    this._medicoService.buscarMedico(termino)
      .subscribe( (medicos: Hospital[]) => {
        this.medicos = medicos;
        this.cargando = false;
      });

  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Está seguro?',
      text: '"' + medico.nombre + '" será eliminado',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then( borrar => {
      
      if (borrar) {
        this._medicoService.borrarMedico(medico._id)
          .subscribe( (borrado: boolean) => {
            // console.log(borrado);
            this.cargarMedicos();
          });
      }
    });
  }

  cambiarDesde(valor: number) {
    let desdeAux = this.desde;
    desdeAux += valor;

    if (desdeAux < 0 || desdeAux >= this.totalRegistros) {
      return;
    }
    
    this.desde = desdeAux;
    this.cargarMedicos();
  }

}
