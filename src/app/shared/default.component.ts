import { Router } from '@angular/router'
import { Location } from '@angular/common';
import { DomainServices } from '../services/domain.services';
import { ValidateCb, BackendResponseListAllInterface, PaginateEventInterface, BatchParams, CreateOptions, DeleteOptions } from '../shared/default.interfaces';
import { NgxSpinnerService } from 'ngx-spinner';

import * as uuid from 'uuid';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HostListener, TemplateRef } from '@angular/core';


const type_of_events = ['change_enterprise', 'login', 'logout']
const type_orders = { 'true': 'desc', 'false': 'asc' }
const enum TypeOfBatch { CREATE, LIST }


export abstract class DefaultComponent {
    abstract _router: Router
    abstract _location: Location
    abstract _service: DomainServices
    
    abstract _apiView: string

    public _defaultDialog: any
    public _dialogRef: any;
    public _loading: NgxSpinnerService = null
    public _toast: ToastrService = null
    public _permissions: object = null
    public _uploading: boolean = null
    public _data: any = [];
    public _object: any = {}


    public keys = Object.keys


    /**
     * Informações úteis para Paginação de elementos
     */
    public _moduleName: string = ''
    public _order: string = 'asc'
    public _order_attr: string = 'id'
    public _pageSizeOptions = [10, 25, 50, 100]
    public _next: object = null
    public _previous: object = null
    public _currentPage = 1
    public _pageSize = 25
    public _total = 0
    public _q: string
    public _advancedFilters: object

    public _innerWidth

  
    get isMobile(): boolean {
        return this.innerWidth < 480
    }
    

    get apiView(): string {
        return this._apiView
    }


    get service(): DomainServices {
        return this._service
    }


    get loading(): NgxSpinnerService {
        if (!this._loading) console.warn("Verifique a instanciação do atributo '_loading'")

        return this._loading
    }


    get toast(): ToastrService {
        if (!this._toast) console.warn("Verifique a instanciação do atributo '_toast'")

        return this._toast
    }


    get currentModule(): string {
        let currentModule = this._router.url.split('/')[1]
        console.debug('currentModule', currentModule)

        return currentModule
    }


    get q() {
        return this._q
    }

    get innerWidth() {
        return window.innerWidth
    }


    set q(value: string) {
        this._q = value
    }


    get isCreate(): boolean {
        return this._router.url.indexOf('/create') !== -1
    }


    get isEdit(): boolean {
        return this._router.url.indexOf('/edit') !== -1
    }

    set next(value:string) {
        this._next = this.parseQueryParamsToObject(value)
    }

    set previous(value:string) {
        this._previous = this.parseQueryParamsToObject(value)
    }

    /**
     * Method to start and list init data from apiView
     */
    public listInitData() {
        this.read(this._service, this._apiView)   
    }


    /**
     * Method to parse value after '?' in query params and get a object from it 
     * @param value 
     */
    private parseQueryParamsToObject(value:string) {
        let params = value.split('&')
        let object = {}
        let keyValue

        params.forEach((value:string) => {
            keyValue = value.split('=')
            object[keyValue[0]] = keyValue[1]
        })

        return object
    }


    checkAll(targetArray: Array<any>, checkAttr: string = '_allChecked', modelAttr: string = 'checked', exceptsAttr: string = null) {
        console.debug("checkAll()", targetArray.length)

        this[checkAttr] = !this[checkAttr]

        targetArray.forEach((object) => {
            if (exceptsAttr !== null) {
                if (!object[exceptsAttr]) object[modelAttr] = this[checkAttr]
            }

            else {
                object[modelAttr] = this[checkAttr]
            }

        })
    }


    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return "0 Bytes";
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }


    async initObject() {
        if (this.isEdit) {
            let response = await this._service.setModule(`${this._apiView}/${this.getCurrentId()}/`).get().process_request(false, false)
            this._object = response.results[0]
        }
        
        else {
            this._object = {}
        }
       
        console.debug("initObject: ", this._object)

    }


    navigateTo(url: string[], data?: any): void {
        console.debug('navigateTo', url, data)
        this._router.navigate(url, data)
            .then((success) => {
                console.debug("Navegação Concluída: ", success)
            })
            .catch((error) => {
                console.error("Navegação sem sucesso: ", error)
            })

    }


    navigateBack(): void {
        if (!this._location) throw new Error("Verifique se o atributo '_location' está instanciado para executar essa função.")
        this._location.back()
    }


    showLoading(): void {
        console.debug("showLoading")
        if (!this.loading) return;
        this.loading.show()
    }


    showToast(message: string, type: string = 'error'): void {
        console.debug("showToast")
        if (!this.toast) return;
        this.toast[type](message)
    }


    hideLoading(): void {
        console.debug("hideLoading")
        if (!this.loading) return
        this.loading.hide()
    }


    getCurrentId(): string {
        /**
         * Função utilizada para pegar o identificador atual carregado no módulo de navegação
         */
        let urlArray = this._router.url.split('/')

        return urlArray[urlArray.length - 1]
    }


    getCurrentQueryParams(): object {
        let queryParams = {
            'page': this._currentPage,
            'size': this._pageSize,
            'order_attr': this._order_attr,
            'order': this._order
        }

        if (this._q) {
            queryParams['q'] = this._q
        }

        if (this._advancedFilters) {
            queryParams = { ...this._advancedFilters, ...queryParams }
        }

        return queryParams
    }


    getValueElementById(id: string, options?: any) {
        console.debug("Buscando por Id: ", id)

        let _element = (<HTMLInputElement>document.getElementById(id)).value

        _element = _element.replace(/^\s+|\s+$/g, '')

        if (options !== undefined && options.hasOwnProperty('empty') && options.empty) return _element

        if (_element === '') return null

        return _element;
    }


    setValueElementById(id: string, value?: string, options?: any) {
        let _element = (<HTMLInputElement>document.getElementById(id))

        if (value) _element.value = value

        if (options) {
            if (options.with_error) {
                _element.style.borderColor = "red"

                setTimeout(() => {
                    _element.style.borderColor = null
                }, 2000)
            }
        }

    }

    removeNotNumbers(value:String) {
        return value.replace(/[^0-9]/g, "")
    }


    openDialog(
        dialog: MatDialog,
        content: TemplateRef<any>,
        options?: MatDialogConfig,
        callBackAfterClose?: Function
    ) {
        if (!options) {
            if (this.innerWidth < 480) {
                options = { width: '100%', minHeight: '60%' }
            }

            else {
                options = { width: '60%', minHeight: '80%' }
            }
        } 
        
        console.debug("opções Dialog: ", options)

        this._dialogRef = dialog.open(content, options);

        this._dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);

            if (callBackAfterClose) callBackAfterClose(result)
        });
    }


    closeCurrentDialogRef() {
        this._dialogRef.close();
    }


    /**
     * Função para operacionalizar a paginação das tabelas em nossa aplicação.
     * 
     * 
     */
    changeTablePage(event: PaginateEventInterface) {
        let queryParams = null

        if (event.pageIndex > event.previousPageIndex) {
            queryParams = this._next
        }

        else {
            queryParams = this._previous
        }

        this.read(
            this._service,
            this._apiView,
            queryParams
        )
    }



    async create(
        service?: DomainServices,
        apiView?: string,
        data?: object,
        validadeCb?: ValidateCb,
        options?: CreateOptions) {

        let response = null;

        if (!service) service = this._service
        if (!apiView) apiView = this._apiView
        if (!options) options = { 'navigateBack': true }
        if (!data) data = this._object
        if (options['showSuccessMessage'] === undefined) options['showSuccessMessage'] = true
        if (options['showErrorMessage'] === undefined) options['showErrorMessage'] = true
        if (!options['successMessage']) options['successMessage'] = "Dados Salvos!"
        if (!options['errorMessage']) options['errorMessage'] = "Erro ao tentar atualizar dados!"


        if (validadeCb && !validadeCb(data)) return

        this.showLoading()

        console.debug("Opções da Requisição: ", options)

        try {
            response = await service.setModule(apiView).setBodyParams(data).post()
                .process_request(
                    options.showSuccessMessage,
                    options.showErrorMessage,
                    options.successMessage,
                    options.errorMessage)

            console.debug("create ", response)

        } catch (error) {
            console.error(error)
            throw error
        }
        finally {
            this.hideLoading()
        }

        if (response && options && options['navigateBack']) this.navigateBack()

    }


    async read(
        service?: DomainServices,
        apiView?: string,
        options?: object,
        cbSuccess?: Function,
        cbError?: Function
    ): Promise<BackendResponseListAllInterface> {
        if (!service) service = this._service
        if (!apiView) apiView = this._apiView

        let response = { results: [], count: 0, next: null, previous: null }

        this.showLoading()

        try {
            response = await service.setModule(`${apiView}/`).get().setQueryParams(options).process_request(false, true)
            
            if (response.next) this.next = response.next.split('?')[1]
            if (response.previous) this.previous = response.previous.split('?')[1]
            
            this._total = response.count
            this._data = response.results

            if (cbSuccess) cbSuccess(response)


        } catch (error) {
            if (cbError) cbError(error)
        }
        finally {
            this.hideLoading()
        }

        return response;

    }


    async update(
        service?: DomainServices,
        apiView?: string,
        data?: object,
        options?: CreateOptions) {

        let response = null;

        if (!service) service = this._service
        if (!apiView) apiView = this._apiView
        if (!options) options = { 'navigateBack': true }
        if (!data) data = this._object
        if (options['showSuccessMessage'] === undefined) options['showSuccessMessage'] = true
        if (options['showErrorMessage'] === undefined) options['showErrorMessage'] = true
        if (!options['successMessage']) options['successMessage'] = "Dados Atualizados!"
        if (!options['errorMessage']) options['errorMessage'] = "Erro ao tentar atualizar dados!"

        this.showLoading()

        try {
            response = await service.setModule(apiView).setBodyParams(data).put()
                .process_request(
                    options.showSuccessMessage,
                    options.showErrorMessage,
                    options.successMessage,
                    options.errorMessage
                )

            console.debug("update ", response)

        } catch (error) {
            console.error(error)
        }
        finally {
            this.hideLoading()
        }

        if (response && options && options['navigateBack']) this.navigateBack()

    }


    async delete(
        id,
        service?: DomainServices,
        apiView?: string,
        options?: object,
        cbSuccess?: Function,
        cbError?: Function) {
        if (!service) service = this._service
        if (!apiView) apiView = this._apiView

        let response = null;

        if (!confirm('Tem certeza que deseja realizar essa ação?')) return
        
        this.showLoading()

        try {
            response = await service.setModule(`${apiView}/${id}/`).delete().process_request(true, true, "Dados Deletados!")

        } catch (error) {
            console.error(error)
        }
        finally {
            this.hideLoading()
        }

        this.read(service, apiView)

    }


    async duplicate(
        id: string,
        service?: DomainServices,
        apiView?: string,
        resetView?: boolean,
        cbSuccess?: Function,
        cbError?: Function
    ): Promise<any> {

        if (!service) service = this._service
        if (!apiView) apiView = this._apiView
        if (!resetView) resetView = true

        let response = {}

        this.showLoading()

        try {
            response = await service.setModule(apiView + '/duplicate').setBodyParams({ 'id': id }).post()
                .process_request(false, true)

            console.debug("duplicate ", response)

            if (resetView) this['ngOnInit']()

        } catch (error) {
            console.error(error)
        }
        finally {
            this.hideLoading()
        }

        return response;

    }


    async download(id: any) {
        this.showLoading()
        
        try {
            let response = await this._service.get().setModule(`files/download/${id}/`).process_request(false, false)
            window.open(response.url, "_blank");
        }
        catch (error) {
            console.error(error)
        }
        finally {
            this.hideLoading()
        }
    }


    async deleteFileById(id, afterFunction: string) {
        if (!window.confirm('Tem certeza que deseja remover esse arquivo? Essa operação removerá esse anexo de todas as aulas e atividades.')) return

        this.showLoading()

        try {
            let response = await this._service.setModule('Attachment').setBodyParams({ 'id': id }).delete()
                .process_request(true, true, 'Arquivo deletado!')

            this[afterFunction]()

        } catch (error) {
            console.error(error)
        }
        finally {
            this.hideLoading()
        }
    }

    
}
