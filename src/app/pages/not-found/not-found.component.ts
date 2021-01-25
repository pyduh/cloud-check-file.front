import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomainServices } from 'src/app/services/domain.services';
import { DefaultComponent } from 'src/app/shared/default.component';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent extends DefaultComponent implements OnInit {
  _apiView: string;
  _apiModule: string;
  _service: DomainServices;

  constructor(
    public _router: Router,
    public _location: Location
  ) {
    super()
  }

  ngOnInit() {
  }

}
