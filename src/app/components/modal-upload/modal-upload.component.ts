import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  // imagenTemp debería ser de tipo string, pero por alguna razon tira un error si lo instancio como string.
  imagenTemp;
  saveFlag: boolean;

  constructor( public _subirArcahivoService: SubirArchivoService, public _modalUploadService: ModalUploadService ) {
  }

  ngOnInit() {
  }

  seleccionImagen( archivo: File ){
    if ( !archivo ) {
      this.saveFlag = false;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    
    let reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;
    this.saveFlag = true;
  }

  subirImagen() {
    this._subirArcahivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
      .then( resp => {
        this._modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch( err => {
        console.log("Error en la carga")
      });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
  }

}
