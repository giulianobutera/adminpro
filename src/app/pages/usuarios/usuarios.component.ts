import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  // Bandera para controlar el estado de los botones anterior y siguiente
  flagBefNext: boolean = true;

  constructor( public _usuarioService: UsuarioService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
      .subscribe( resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
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
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    // Al buscar un usuario la paginación se rompe, por lo que ponemos en disabled los botones anterior y siguiente
    this.flagBefNext = false;

    if (termino.length <= 0) {
      this.cargarUsuarios();
      // si termino.length es 0 significa que ya no se está buscando un usuario, se reactivan los botones
      this.flagBefNext = true;
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino)
      .subscribe( (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      swal('No se pudo borrar el usuario', 'No puede borrarse a si mismo', 'error');
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar al usuario ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then( borrar => {
      console.log(borrar);
      
      if (borrar) {
        this._usuarioService.borrarUsuario(usuario._id)
          .subscribe( (borrado: boolean) => {
            console.log(borrado);
            this.cargarUsuarios();
          });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
      .subscribe();
  }

}
