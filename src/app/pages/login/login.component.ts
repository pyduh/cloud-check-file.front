import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StorageService } from 'src/app/services/storage.services';
import { DomainServices } from 'src/app/services/domain.services';
import { DefaultComponent } from 'src/app/shared/default.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment as config } from '../../../environments/environment';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends DefaultComponent implements OnInit {
  @ViewChild('uploadRef') uploadRef: any;
  _apiView: string;

  _loginArea:boolean = true
  _uploadArea:boolean = false

  _loginForm:boolean = true
  _recoveryForm:boolean = false
  _signupForm:boolean = false

  _continueConnected:boolean = true

  _result:any = null
  _options:Array<any> = []


  constructor(
    public _router: Router,
    public _location:Location,
    public _service: DomainServices,
    public _storage: StorageService) { 
      super();

      this._storage.removeLocalStorage()
  }
  
  ngOnInit(): void {
  }


  changeArea() {
    this._loginArea = !this._loginArea
    this._uploadArea = !this._uploadArea
    console.debug(this.uploadRef.file)
  }


  changeForm(targetForm:string) { 
    this[targetForm] = true

    Object.keys(this).filter(element => element.includes('Form')).filter(element => element != targetForm).forEach(element => this[element] = false)

    this._object = {}
  }


  async login() { 
    this.showLoading()

    try {
      await this._service.login(this._object, 'auth/login/', this._continueConnected)
      this.navigateTo(['home'])          
    }
    finally {
      this.hideLoading()
    }
    
  }

 
  async recovery() {
    this.showLoading()

    try {
      await this._service.post().setModule('auth/forget-password/').setBodyParams(this._object).process_request(true, false, "A nova senha será enviada para o e-mail cadastrado!")
            
      this.changeForm('_loginForm')

    } catch (error) {
      console.error(error)
    }
    finally {
      this.hideLoading()
    }
  }


  async signup() {
    this.showLoading()

    try {
      await this._service.post().setModule('auth/signup/').setBodyParams(this._object).process_request()
      this.changeForm('_loginForm')

    } catch (error) {
      console.error(error)
    }
    finally {
      this.hideLoading()
    }
  }


  verify() {
    const formData: FormData = new FormData();
    formData.append('file', this.uploadRef.file, this.uploadRef.file.name);
    formData.append('id', this._object.id);

    const observable = this._service.upload(formData, {apiModule:'files/verify/', authenticate:false})

    observable.subscribe(
      (event) => {
          if (event.type === HttpEventType.UploadProgress)
              this.uploadRef.progress  = Math.round(100 * event.loaded / event.total);

          else if (event instanceof HttpResponse) {
            this.showResult(event.body)
          }

      },
      (err) => {
          console.error(err)
          this.uploadRef.progress = 0
      }
    )
  }
  

  showResult(requestBody) {
    this._result = requestBody
  }

}
