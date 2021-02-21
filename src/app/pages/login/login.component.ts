import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StorageService } from 'src/app/services/storage.services';
import { DomainServices } from 'src/app/services/domain.services';
import { DefaultComponent } from 'src/app/shared/default.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment as config } from '../../../environments/environment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends DefaultComponent implements OnInit {
  @ViewChild('uploadRef') uploadRef: any;
  _apiView: string;

  _loginArea: boolean = true
  _uploadArea: boolean = false

  _continueConnected: boolean = true

  _result: any = null
  _options: Array<any> = []


  constructor(
    public _router: Router,
    public _location: Location,
    public _service: DomainServices,
    public _storage: StorageService,
    public _toast: ToastrService,
    ) {
    super();

    this._storage.removeLocalStorage()
  }

  ngOnInit(): void {
  }


  changeArea() {
    this._loginArea = !this._loginArea
    this._uploadArea = !this._uploadArea
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


  verify() {
    // Verify if this._object.id is a number
    if (isNaN(this._object.id)) {
      this.showToast('Verifique o campo "código". Ele deve ser um numeral válido.', 'warning')
      return
    }
    const formData: FormData = new FormData();
    formData.append('file', this.uploadRef.file, this.uploadRef.file.name);
    formData.append('id', this._object.id);

    const observable = this._service.upload(formData, { apiModule: 'files/verify/', authenticate: false })

    observable.subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress)
          this.uploadRef.progress = Math.round(100 * event.loaded / event.total);

        else if (event instanceof HttpResponse) {
          this.showResult(event.body)
        }

      },
      (err) => {
        console.error(err)
        this.uploadRef.progress = 0
        this.showToast('Ocorreu um erro durante o upload. Contate o administrador do sistema.', 'error')
      }
    )
  }


  showResult(requestBody) {
    this._result = requestBody
  }


  reset() {
    this.uploadRef.reset()
    this._object.id = ""
    this._result = null
  }

}
