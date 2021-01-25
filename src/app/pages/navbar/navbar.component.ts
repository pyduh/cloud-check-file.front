import { Location } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DomainServices } from "src/app/services/domain.services";
import { StorageService } from "src/app/services/storage.services";
import { environment } from "src/environments/environment";
import { NgxSpinnerService } from 'ngx-spinner';
import { DefaultComponent } from 'src/app/shared/default.component';


@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent extends DefaultComponent implements OnInit {
  _apiView: string;
  _location: Location;
  _navbarOpen = false;

  _avatar: string = null
  _logo:string = null

  _token: any = null
  
  _user: any = null

  _showChangeProfile: boolean = false;
  _showChangePassword: boolean = false;
  _showPersonalInformations: boolean = false;

  _oldPassword: string = null;
  _newPassword: string = null;
  _newPasswordRepeated: string = null;

  // Menus permissionados da Aplicação:
  _menu: any = {};

  constructor(
    public _router: Router,
    public _dialog: MatDialog,
    public _service: DomainServices,
    public _loading: NgxSpinnerService,
    public _storage: StorageService
  ) {
    super();
    
    this.initLogo()

    this._token = this._storage.openJwtPayload(environment.tokenKey);
   
  }


  ngOnInit() {
  }


  toggleNavbar() {
    this._navbarOpen = !this._navbarOpen;
  }


  navigate(route: string, data?: any) {
    this._router.navigate([route], data);

    if (this._navbarOpen) this._navbarOpen = !this._navbarOpen;

  }


  logout() {
    this._storage.removeLocalStorage();
    this._router.navigate(["login"]);
  }

 
  private initLogo() {
    this._logo = '../../../assets/folder.png'
  }

}
