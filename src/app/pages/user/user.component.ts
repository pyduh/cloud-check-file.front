import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DomainServices } from 'src/app/services/domain.services';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.services';
import { Location } from '@angular/common';

import { DefaultComponent } from 'src/app/shared/default.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends DefaultComponent implements OnInit {
  _location: Location

  _apiView: string
  

  constructor(
    public _router: Router,
    public _service: DomainServices,
    public _toast: ToastrService,
    public _loading: NgxSpinnerService,
    public _dialog: MatDialog,
    private _storage: StorageService
  ) {
    super()
    this._apiView = `auth/users/${this._storage.getMyApplicationId()}`
  }


  ngOnInit() {
    this.listInitData()
  }


  async listInitData() {
    let response = await this.read(this._service, this._apiView)
    this._object = response.results[0]
  }


  async savePassword() {
    this.showLoading();
    try {
      await this._service.setModule(`auth/users/password/`).post().setBodyParams(this._object).process_request(true, true, 'Senha atualizada com sucesso!')
    }
    finally {
      this.hideLoading();
    }
  }


  async saveUser() {
    this.showLoading();
    try {
      await this._service.setModule(`auth/users/${this._storage.getMyApplicationId()}/`).put().setBodyParams(this._object).process_request(true, true, 'Usuário atualizado com sucesso!')
    }
    finally {
      this.hideLoading();
    }
  }


  async deleteUser() {
    if (!confirm('Tem certeza que deseja realizar essa ação?')) return
    await this._service.setModule(`auth/users/${this._storage.getMyApplicationId()}/`).delete().process_request(false, false)
    this._storage.removeLocalStorage();
    this._router.navigate(["login"]);
  }

  
}
