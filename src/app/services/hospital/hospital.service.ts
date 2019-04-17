import { Injectable } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import swal from 'sweetalert';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital: Hospital;

  constructor(
      public http: HttpClient,
      public _router: Router,
      public _subirArchivoService: SubirArchivoService,
      public _usuarioService: UsuarioService
      ) {
  }
  
  cargarHospitales(desde: number = 0) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url);
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url);
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(map( resp => {
      swal('Hopital borrado', 'El hospital ha sido eliminado correctamente', 'success');
      return true;
    }));
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital' + '?token=' + this._usuarioService.token;
    return this.http.post(url, {nombre: nombre}).pipe(map((resp: any) => {
      swal('Hospital creado', nombre, 'success');
      return resp.hospital;
      }));
    
  }

  buscarHospital(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url).pipe(map( (resp: any) => resp.hospitales ));

  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital).pipe(map((resp: any) => {
      console.log('Hospital: ', resp.hospital);
      swal('Hospital actualizado', hospital.nombre, 'success');
      return true;

    }));

  }

}
