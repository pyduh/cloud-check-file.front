import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  _logo

  constructor(
    private _storage: StorageService
  ) { 
    this.initLogo()
  }

  ngOnInit() {
  }


  initLogo() {
    this._logo = '../../../assets/images/aulaplus logo preto.png'
  }

}
