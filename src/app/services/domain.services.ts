import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';

import { cloneDeep } from "lodash";
import { environment as config } from '../../environments/environment'
import { StorageService } from './storage.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UploadOptions } from '../shared/default.interfaces';


enum HttpVerb { GET, POST, PUT, DELETE, PATCH }

declare let window: any;


@Injectable()
export class DomainServices {

    _tokenKey = config.tokenKey;
    _baseUrl: string = config.baseApi;

    _module: string = null;
    _method: HttpVerb = null;
    _query_params: object = {};
    _body_params: object = {};
    _headers: any = null;

    _http: HttpClient = null
    _storage: StorageService = null
    _loading: NgxSpinnerService = null
    _toast: ToastrService = null

    public loadingInstance: any = null


    constructor(
        http: HttpClient,
        loading: NgxSpinnerService,
        toast: ToastrService
    ) {

        this._http = http
        this._loading = loading
        this._toast = toast
        this._storage = new StorageService()

    }


    get http() {
        return this._http
    }


    get headers() {
        // Se não há tamanho no Headers desse Objeto, iremos definí-lo:

        let headers = {}
        let has_token = this._storage.getLocalStorage(config.tokenKey)

        headers["Content-Type"] = 'application/json'
        //headers["Host-Origin"] = window.location.host

        if (has_token) headers['Authorization'] = `Bearer ${has_token}`

        return headers

    }


    get bodyParams() {
        return this._body_params
    }


    get queryParams(): string {

        if (!this._query_params) return ""
        if (!Object.keys(this._query_params).length) return ""

        let params: string = "";

        Object.keys(this._query_params).forEach((value, index) => {
            params += value + "=" + this._query_params[value];

            if (index < Object.keys(this._query_params).length - 1) params += "&";
        });

        return "?" + params;
    }


    get method() {
        return this._method
    }


    get baseUrl() {

        if (!this._baseUrl) {
            throw new Error("Verifique o parâmetro '_baseUrl' para requisição.")
        }


        return this._baseUrl;
    }


    get module() {
        if (!this._module) {
            throw new Error("Verifique o parâmetro 'module' para requisição. Executar a função a 'setModule'.")
        }

        return this._module;
    }


    get getCompleteRequestUrl(): string {
        let _url = this.baseUrl + this.module + this.queryParams
        return _url
    }


    get getRequestOptions(): object {
        let options: any = null;

        options = { headers: new HttpHeaders(this.headers) }

        // Caso a requisição seja um DELETE, o body deverá ser adicionado agora:
        if (this.method === HttpVerb.DELETE) options["body"] = this.bodyParams

        return options

    }


    public setBodyParams(data: any): this {
        this._body_params = data;
        return this;
    }


    public setQueryParams(data: object): this {
        if (data !== undefined || data !== null)
            this._query_params = data;

        return this;
    }


    public setModule(value: string): this {
        this._module = value
        return this
    }


    public setBaseUrl(value: string): this {
        this._baseUrl = value
        return this
    }

    public generic(method:string): this {
        this._method = HttpVerb[method]
        return this;
    }

    public post(): this {
        this._method = HttpVerb.POST;
        return this;
    }


    public get(): this {
        this._method = HttpVerb.GET;
        return this;
    }


    public delete(): this {
        this._method = HttpVerb.DELETE;
        return this;
    }


    public put(): this {
        this._method = HttpVerb.PUT;
        return this;
    }


    /**
     * Função para fazer o processamento da requisição. 
     * @param showLoading 
     * @param waiting_message 
     * @param show_success_message 
     */
    process_request(
        show_success_message: boolean = true,
        show_error_message: boolean = true,
        success_message: string = "Operação realizada com sucesso!",
        error_message: string = "Operação realizada sem sucesso!"): Promise<any> {

        let method = this.method;

        if (method === HttpVerb.POST) {
            return this.doRequest(
                this._http.post(this.getCompleteRequestUrl, this.bodyParams, this.getRequestOptions),
                show_success_message,
                show_error_message,
                success_message,
                error_message
            )
        }

        if (method === HttpVerb.GET) {
            return this.doRequest(
                this._http.get(this.getCompleteRequestUrl, this.getRequestOptions),
                show_success_message,
                show_error_message,
                success_message,
                error_message
            )
        }

        if (method === HttpVerb.PUT || method === HttpVerb.PATCH) {
            return this.doRequest(
                this._http.patch(this.getCompleteRequestUrl, this.bodyParams, this.getRequestOptions),
                show_success_message,
                show_error_message,
                success_message,
                error_message
            );
        }

        if (method === HttpVerb.DELETE) {
            return this.doRequest(
                this._http.delete(this.getCompleteRequestUrl, this.getRequestOptions),
                show_success_message,
                show_error_message,
                success_message,
                error_message
            );
        }

        throw new Error(`Verifique o metodo HTTP para a função: ${method}`)

    }



    select(options?: any) {

        let request = this.setBaseUrl(this.baseUrl).setModule('selects')

        if (options) request = request.setQueryParams(options)

        return request.get()
            .process_request(false, true)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error("> selects() ", error)
                throw error
            })

    }


    login(
        body: any,
        requestModule:string,
        continueConnected:boolean=true
    ): Promise<any> {

        let request = this.setBaseUrl(this.baseUrl).setModule(requestModule).setBodyParams(body)

        return request.post()
            .process_request(false, false)
            .then((data) => {
                this._storage.setLocalStorage(this._tokenKey, data.access)
                if (continueConnected && data.refresh)
                    this._storage.setLocalStorage(`refresh_${this._tokenKey}`, data.refresh)
                
                return data;
            })
            .catch((error) => {
                console.error("Login Error Callback ", error)
                this._toast.error("Usuário e/ou senha.")
                throw error
            })
    }


    create(
        requestModule: string,
        bodyParams: object,
        baseUrl?: string,
        options?: any) {

        if (!baseUrl) baseUrl = this.baseUrl

        let showLoading: boolean = options['showLoading'] ? options['showLoading'] : true
        let waiting_message: string = options['waiting_message'] ? options['waiting_message'] : null
        let show_success_message: boolean = options['show_success_message'] ? options['show_success_message'] : true
        let show_error_message: boolean = options['show_error_message'] ? options['show_error_message'] : true
        let success_message: string = options['success_message'] ? options['success_message'] : "Dados salvos com sucesso"
        let error_message: string = options['error_message'] ? options['error_message'] : "Não foi possível salvar seus dados"


        return this
            .setBaseUrl(baseUrl)
            .setModule(requestModule)
            .setBodyParams(bodyParams)
            .post()
            .process_request(show_success_message, show_error_message, success_message, error_message)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                throw error
            })

    }


    remove(
        requestModule: string,
        bodyParams: object,
        baseUrl?: string,
        options?: object) {

        if (!baseUrl) baseUrl = this.baseUrl

        let request = this
            .setBaseUrl(baseUrl)
            .setModule(requestModule)
            .setBodyParams(bodyParams)

        return request.delete()
            .process_request(true, true, "Dados deletados com sucesso!", null)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                throw error
            })

    }


    read(
        requestModule: string,
        queryParams?: any,
        baseUrl?: string,
        options?: object) {

        if (!baseUrl) baseUrl = this.baseUrl

        return this
            .setBaseUrl(this.baseUrl)
            .setModule(requestModule)
            .setQueryParams(queryParams)
            .get()
            .process_request(false, true, undefined, undefined)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                throw error
            })
    }


    upload(
        formData: FormData,
        options:UploadOptions
        ): Observable<any> {
        let requestOptions = {reportProgress: true, observe: 'observe', headers: new HttpHeaders({})}
        
        if (options.authenticate === undefined || options.authenticate) {
            requestOptions['headers'] = requestOptions['headers'].append('Authorization', `Bearer ${this._storage.getLocalStorage(this._tokenKey)}`)
        }

        console.debug(requestOptions)

        const req = new HttpRequest('POST', `${this._baseUrl}${options.apiModule}`, formData, requestOptions);

        return this._http.request(req)

    }


    makeUpload(file: Blob, fileName: string, apiModule: string = 'attachment'): Promise<any> {
        const formData: FormData = new FormData();

        formData.append('file', file, fileName);
        let options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${this._storage.getLocalStorage(this._tokenKey)}` }) }

        return this._http.request(new HttpRequest('POST', `${this._baseUrl}${apiModule}`, formData, options)).toPromise()

    }


    makeManyUpload(files: Blob[], baseName: string, apiModule: string = 'attachment-many'): Promise<any> {
        let formData: FormData = new FormData();

        files.forEach((file, index) => {
            formData.append(`file_${index + 1}`, file, `${index + 1}-${baseName}`);
        })

        let options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${this._storage.getLocalStorage(this._tokenKey)}` }) }

        return this._http.request(new HttpRequest('POST', `${this._baseUrl}${apiModule}`, formData, options)).toPromise()
    }


    download(id: string, apiModule: string = 'attachment', processed:boolean=false): Promise<any> {
        let options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${this._storage.getLocalStorage(this._tokenKey)}` }) }

        let url = `${this._baseUrl}${apiModule}/${id}`

        if (processed)
            url += `/processed`

        return this._http.get(url, options).toPromise()
            .then((file) => file)
            .catch(async (error) => {
                let truError = JSON.parse(await error.error.text())
                error.error = truError

                throw error
            })

    }


    makeProperlyDownload(blob: Blob, object: any) {
        let downloadURL = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = downloadURL;
        link.download = object.name;
        link.click();
    }



    doRequest(
        request: Observable<any>,
        showSuccessMessage: boolean,
        showErrorMessage: boolean,
        baseSuccessMessage: string,
        baseErrorMessage: string) {

        console.debug("doRequest")

        return request.toPromise()
            .then((response) => {
                console.debug("Resposta da Requisição: ", response)
                console.debug("Process Request Success Callback ", response)

                // Limpando as variáveis declaradas na requisição:
                this.clearRequestObject()

                // Caso a mensagem de sucesso deva ser mostrada:
                if (showSuccessMessage) {
                    this._toast.success(baseSuccessMessage)
                }

                return response;

            })
            .catch((e) => {
                console.error("Process Request Error Callback ", e)
                this.clearRequestObject()

                // Definindo a mensagem de erro:
                if (showErrorMessage) {
                    if (e.error) {
                        Object.keys(e.error).forEach(key => this._toast.error(`${key}: ${e.error[key].join(',')}`))
                    }

                    this._toast.error(baseErrorMessage)

                }

                // Caso a mensagem de erro seja a 1, devemos recarregar o app e deslogar o usuário:
                if (e.error && e.error.code === 1) {
                    this._storage.removeLocalStorage(this._tokenKey)
                    window.location.reload()
                }

                throw e
            })

    }
    

    clearRequestObject(): void {
        this._query_params = {};
        this._body_params = {};
        this._headers = null;
        this._method = null;
    }




}
