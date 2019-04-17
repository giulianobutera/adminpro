import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  medico: Medico = new Medico('', '', '', '');
  hospitales: Hospital[] = [];
  hospital: Hospital = new Hospital('');

  constructor( public _medicoService: MedicoService,
               public _hospitalService: HospitalService,
               public router: Router,
               public activatedRoute: ActivatedRoute,
               public _modalUploadService: ModalUploadService ) {

    activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
      .subscribe( (resp: any) => this.hospitales = resp.hospitales );
    
    this._modalUploadService.notificacion.subscribe( (resp: any) => {
      this.medico.img = resp.medico.img;
    });
  }

  guardarMedico(formulario: NgForm) {

    if ( formulario.invalid ) { return }
    
    this._medicoService.guardarMedico(this.medico)
      .subscribe( resp => {
        this.medico._id = resp._id
        this.router.navigate(['/medico', resp._id]);
      });
  }

  cambioHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
      .subscribe( (resp: any) => this.hospital = resp.hospital );
  }

  cargarMedico(id: string) {
    this._medicoService.cargarMedico(id)
      .subscribe( (resp: any) => {
        this.medico = resp;
        this.medico.hospital = resp.hospital._id;
        this.cambioHospital(this.medico.hospital);
      });
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
