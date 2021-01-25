import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DomainServices } from 'src/app/services/domain.services';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.services';
import { Location } from '@angular/common';


import { BatchParams } from 'src/app/shared/default.interfaces';
import { DefaultComponent } from 'src/app/shared/default.component';
import * as Chart from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends DefaultComponent implements OnInit {
  _apiView: string = 'files/dashboard'
  _location:Location

  _myProfile:string;
  _apiModule: string;

  _notifications: any[] = []

  
  constructor(
    public _router: Router,
    public _service: DomainServices,
    public _toast: ToastrService,
    public _loading: NgxSpinnerService,
    public _dialog: MatDialog,
    private _storage:StorageService
  ) {
    super()
  }
  
  ngOnInit() {
    this.listInitData()
   }

}
