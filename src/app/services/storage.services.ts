import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import * as uuid from 'uuid';


@Injectable()
export class StorageService {
    

  constructor() { }


  public setLocalStorage(key, value) {
    window.localStorage.setItem(key, value);
    return true;
    
  }


  public getLocalStorage(key, value?: any, parsing?:boolean) {
    let storaged:any = window.localStorage.getItem(key);

    if (storaged === null && (value !== undefined && value !== null))   return value;
    if (parsing !== undefined && parsing === true)                      return JSON.parse(storaged);
    
    return storaged
  }


  public removeLocalStorage(key?:string) {
    if (key === undefined)    window.localStorage.clear();
    else                      window.localStorage.removeItem(key);
     return true
  }


  public openJwtPayload(key?:string): object {
    if (!key) key = environment.tokenKey
    
    let token = this.getLocalStorage(key)
        
    if (!token) return null

    return JSON.parse(atob(token.split('.')[1]))

  }


  public getMyApplicationId() {
    let token = this.openJwtPayload()
    console.debug(token)

    if (!token) return null

    return token['user_id']
  }


  public getMyDomainId() {
    let token = this.openJwtPayload()

    if (!token) return null

    return token['school']['id']
  }


  public isAdmin(): boolean {
    let token = this.openJwtPayload();
    
    return token['profile']['id'] === "0192f57a-46fe-40ee-8c19-3f2a991580b0"
  }


  public isDomain(): boolean {
    let token = this.openJwtPayload()
    return token['school']['super'] === null
  }




}
