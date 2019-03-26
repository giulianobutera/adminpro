import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import swal from 'sweetalert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  // imagenTemp debería ser de tipo string, pero por alguna razon tira un error si lo instancio como string.
  imagenTemp;

  constructor( public _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar( usuario: Usuario ) {
    this.usuario.nombre = usuario.nombre;
    
    if ( !this.usuario.google ){
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario( this.usuario )
      .subscribe();
  }

  seleccionImagen( archivo: File ){
    if ( !archivo ) {
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
  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
