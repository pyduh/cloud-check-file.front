import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from './storage.services';
import { environment as config } from '../../environments/environment'

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private _router: Router,
    private _storage: StorageService

  ) { }
  
  
  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      this._router.navigate(['login']);
      return false;
    }

    return true;
  }


  isAuthenticated(): boolean {  
    let token = this._storage.getLocalStorage(config.tokenKey);
    return token !== null
  }
  
}
