import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.services';
import { DomainServices } from 'src/app/services/domain.services';
import { DefaultComponent } from 'src/app/shared/default.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends DefaultComponent implements OnInit {
  _apiView: string;

  _result: any = null
  _strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\'!@#\$%\^&\*])(?=.{8,})");


  constructor(
    public _router: Router,
    public _location: Location,
    public _service: DomainServices,
    public _storage: StorageService) {
    super();

    this._storage.removeLocalStorage()
  }

  async ngOnInit() {
    await this.verifyInvite()
  }

  
  async signup() {
    this.showLoading()
    if (this.isInvite()) this._object['invite_id'] = this.getCurrentId()

    try {
      await this._service.post().setModule('auth/signup/').setBodyParams(this._object).process_request()
      this.navigateTo(['login'])

    } catch (error) {
      console.error(error)
    }
    finally {
      this.hideLoading()
    }
  }


  async verifyInvite() {
    if (!this.isInvite()) return
    try {
      await this._service.get().setModule(`auth/invites/verify/${this.getCurrentId()}/`).process_request(false, false)
    } catch (error) {
      this.navigateTo(['signup'])
    }

  }


  isInvite() {
    let invite_id = this.getCurrentId()
    return invite_id !== 'signup'
  }


  isStrongPassword() {
    let isStrong = true

    if (this._object.password && !this._object.password.length) isStrong = false

    if (!this._strongPasswordRegex.test(this._object.password)) isStrong = false

    return isStrong
  }

}
