export interface ValidateCb {
    (data: object, options?: object): boolean;
}

export interface BackendResponseListAllInterface {
    results: Array<any>,
    count: number,
    next: string,
    previous: string,
}

export interface MenuInterface {
    controle_acesso:    object;
    gestor_rede:        object;
    gestor_unidade:     object;
    administradora:     object;
}


export interface PaginateEventInterface {
    previousPageIndex:  number
    pageIndex:          number
    pageSize:           number 
    length:             number
}


export interface AdvancedFiltersInterface {
    key:    string
    value:  any
    type?:  Function
}

export interface AdvancedFiltersObjectInterface {
    condition:    string
    attribute:    string
    value:        any
    __attribute__?:string
    __condition__?:string
    __value__?:string
}


export interface PermissionsWindowInterface {
    canCreate:      boolean
    canEdit:        boolean
    canDelete:      boolean
    canList?:       boolean 
}


export interface BatchRequest {
    model: string
    method: string,
    body_params?: object
    query_params?: object
    function?:string
}


export interface BatchParams {
    requests:       BatchRequest[]
}


export interface CreateOptions {
    navigateBack: boolean
    successMessage?:string
    errorMessage?: string,
    showSuccessMessage?:boolean,
    showErrorMessage?:boolean,
}


export interface DeleteOptions {
    reload: boolean
    successMessage?:string
}

export interface Api {
    apiModule: string
}


export interface UploadOptions extends Api {
    authenticate?:boolean
}





