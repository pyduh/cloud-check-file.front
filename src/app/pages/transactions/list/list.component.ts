import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DefaultComponent } from '../../../shared/default.component';
import { DomainServices } from '../../../services/domain.services';
import { StorageService } from 'src/app/services/storage.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

const clonedeep = require('lodash.clonedeep')

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends DefaultComponent implements OnInit {
  @ViewChild('checksTemplate') checksTemplate: TemplateRef<any>
  
  _checks: any[] // Dados de checagem. Será definido com um click na tabela

  _location:    Location
  _apiView:     string = 'files'
  _readOnInit:  boolean = true
  _moduleName:  string = 'Meus Envios'
  _order_attr:  string = 'created_at'
  _order:       string = 'desc'

  _displayedColumns = ['icon', 'name', 'created_at', 'size', 'checks', 'id', 'hash', 'actions']
  
  constructor(
    public _router: Router,
    public _service: DomainServices,
    public _loading: NgxSpinnerService,
    public _toast: ToastrService,
    public _storage: StorageService,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar) {

    super();
  }

  ngOnInit() {
    this.listInitData()
  }


  showHash(message: string) {
    this._snackBar.open(message, 'Fechar', {duration: 5000});
  }
  
  openChecks(data:Array<any>) {
    this._checks = data
    this.openDialog(this._dialog, this.checksTemplate)
  }

}
