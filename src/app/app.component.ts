import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aws-test';

  constructor ( private store: StorageService ) {

  }
  ngOnInit(): void {
    this.store.prueba3()
  }



}
