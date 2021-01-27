import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { DomainServices } from '../../../services/domain.services';
import { DefaultComponent } from '../../../shared/default.component';
import { BatchParams, ValidateCb } from 'src/app/shared/default.interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent extends DefaultComponent implements OnInit {
  @ViewChild('uploadRef') uploadRef: any;
  
  uploadArea = true
  
  _today = new Date()
  _apiView: string = 'files'
  _readOnInit: boolean = true

  _attachmentToChoose: MatTableDataSource<any>

  _modelCurrentAttachments: string[] = [];
  _allCheckedAttachment: boolean = false;

  _classesToChoose: any[] = [];
  _modelCurrentClasses: string[] = [];
  _otherLessons:any[] = []
  _allCheckedClasses: boolean = false;

  _targetLesson: any = null
  _target: any = null 


  constructor(
    public _router: Router,
    public _service: DomainServices,
    public _location: Location,
    public _toast: ToastrService,
    public _loading: NgxSpinnerService,
    public _dialog: MatDialog
  ) {
    super()
    this.initObject()
  }


  ngOnInit() { }

  
  uploadFile(onSuccess?:Function) {
    const formData: FormData = new FormData();
    formData.append('file', this.uploadRef.file, this.uploadRef.file.name);

    const observable = this._service.upload(formData, {apiModule:'files/upload/'})

    observable.subscribe(
      (event) => {
          if (event.type === HttpEventType.UploadProgress)
              this.uploadRef.progress  = Math.round(100 * event.loaded / event.total);

          else if (event instanceof HttpResponse) {
            if (onSuccess) onSuccess(event.body)
          }

      },
      (err) => {
          console.error(err)
          this.uploadRef.progress = 0
      }
    )
  }


  async saveFile() {
    this.showLoading()

    this.uploadFile(async (data) => {
      data['name'] = this._object.name
      await this._service.post().setModule('files/').setBodyParams(data).process_request(true, true, "Arquivo criado com sucesso!")
      this.uploadRef.reset()
      this._object = {}
      this.hideLoading()
    })

  }


  async editFile() {
    if (!this.uploadRef.file) {
      await this._service.put().setModule(`files/${this.getCurrentId()}/`).setBodyParams({'name': this._object.name}).process_request(true, true, "Arquivo atualizado com sucesso!")
      return
    }

    this.showLoading()

    this.uploadFile(async (data) => {
      data['name'] = this._object.name
      await this._service.put().setModule(`files/${this.getCurrentId()}/`).setBodyParams(data).process_request(true, true, "Arquivo atualizado com sucesso!")
      this.uploadRef.reset()
      this._object = {}
      this.hideLoading()
    }) 
        
  }


}
