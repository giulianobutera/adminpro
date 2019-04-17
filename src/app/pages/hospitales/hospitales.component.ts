import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  hospitalBuscado: Hospital;
  totalRegistros: number = 0;
  cargando: boolean;
  // Bandera para controlar el estado de los botones anterior y siguiente
  flagBefNext: boolean = true;

  constructor(public _hospitalService: HospitalService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
      .subscribe( resp => this.cargarHospitales() );
  }

  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde)
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.hospitales = resp.hospitales;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    let desdeAux = this.desde;
    desdeAux += valor;

    if (desdeAux < 0 || desdeAux >= this.totalRegistros) {
      return;
    }
    
    this.desde = desdeAux;
    this.cargarHospitales();
  }

  obtenerHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
      .subscribe( (resp: any) => {
        console.log('hospital: ', resp.hospital);
        this.hospitalBuscado = resp.hospital;
      });
  }

  borrarHospital(hosp: Hospital) {
    swal({
      title: '¿Está seguro?',
      text: '"' + hosp.nombre + '" será eliminado',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then( borrar => {
      
      if (borrar) {
        this._hospitalService.borrarHospital(hosp._id)
          .subscribe( (borrado: boolean) => {
            // console.log(borrado);
            this.cargarHospitales();
          });
      }
    });
  }

  crearHospital() {
    swal({
      title: 'Creando nuevo Hospital',
      text: 'Ingrese el nombre del nuevo hospital (Mínimo 4 letras)',
      icon: 'info',
      content: "input",
      buttons: true,
    })
    .then( (nombre: string) => {
      if (nombre === null) { return; }
      if (nombre.length < 4) {
        swal('No se pudo crear el hospital', 'El nombre es demasiado corto', 'error');
        return;
      } else {
        this._hospitalService.crearHospital(nombre)
          .subscribe( (resp: any) => {
            this.cargarHospitales();
            console.log(resp);
          });
      }
    });
  }

  buscarHospital(termino: string) {
    // Al buscar un usuario la paginación se rompe, por lo que ponemos en disabled los botones anterior y siguiente
    this.flagBefNext = false;

    if (termino.length <= 0) {
      this.cargarHospitales();
      // si termino.length es 0 significa que ya no se está buscando un usuario, se reactivan los botones
      this.flagBefNext = true;
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital(termino)
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });

  }

  actualizarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
      .subscribe();
  }

}
