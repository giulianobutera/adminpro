import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
  @ViewChild('txtProgress') txtProgress: ElementRef;
  @Input() progreso = 0;
  @Input('nombreLeyenda') leyenda: string;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  cambiarValor( valor: number) {
    this.progreso += valor;

    if (this.progreso <= 0) {
      this.progreso = 0;
    }
    if (this.progreso >= 100) {
      this.progreso = 100;
    }

    this.cambioValor.emit(this.progreso);
  }

  onChanges( newValue: number) {
    // let elemHTML: any = document.getElementsByName('progreso')[0];
    this.progreso = newValue;

    if (this.progreso <= 0) {
      this.progreso = 0;
    }
    if (this.progreso >= 100) {
      this.progreso = 100;
    }

    // elemHTML.value = Number(this.progreso);
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }

}
