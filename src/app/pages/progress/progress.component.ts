import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {
  progresoAzul = 0;
  progresoVerde = 0;

  constructor() { }

  ngOnInit() {
  }

}
