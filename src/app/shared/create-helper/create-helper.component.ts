import { Component, OnInit, Input } from '@angular/core';
import { DefaultComponent } from '../../shared/default.component';
import { DomainServices } from 'src/app/services/domain.services';
import { AdvancedFiltersInterface, AdvancedFiltersObjectInterface } from 'src/app/shared/default.interfaces';


const CONDITIONS = [
  {'key': 'equal', 'value': 'Igual a'},
  {'key': 'diff', 'value': 'Diferente de'},
  {'key': 'contains', 'value': 'Contém'}
]

@Component({
  selector: 'app-create-helper',
  templateUrl: './create-helper.component.html',
  styleUrls: ['./create-helper.component.css']
})
export class CreateHelperComponent implements OnInit {
  add:Function = null

  @Input() mainComponent    : DefaultComponent = null;
  @Input() apiModule        : string = null;
  @Input() addFunction      : string = null
  @Input() filterFunction   : string = null

  @Input() create           : boolean = true
  @Input() filter           : boolean = true
  @Input() permission       : boolean = true

  @Input() service          : DomainServices = null;
  @Input() filterColumns    : AdvancedFiltersInterface[] = [];
  @Input() _filterConditions : AdvancedFiltersInterface[] = CONDITIONS;


  viewType:string = null;
  openFilters:boolean = false
  openAdvancedFilters:boolean = false

  // Campo de busca padrão
  _q: string = ''

  // Campo de busca avançado
  _filters:   AdvancedFiltersObjectInterface[] = []
  _attr:      AdvancedFiltersInterface = null
  _condition: AdvancedFiltersInterface = null
  _value:     any = null

  isNumber:Function =   (value) => { return typeof value === 'number' || value === Number }
  isBoolean:Function =  (value) => { return typeof value === 'boolean' || value === Boolean }

  constructor() { }

  
  ngOnInit(): void {
    if (!this.mainComponent) throw new Error("Verifique o parâmetro 'mainComponent'")
    if (!this.apiModule)    this.apiModule = this.mainComponent._apiView
    if (!this.service)      this.service = this.mainComponent.service
    if (!this.filterConditions) this.filterColumns = null;

    if      (this.mainComponent._router.url.includes('create')) this.viewType = 'create'
    else if (this.mainComponent._router.url.includes('edit'))   this.viewType = 'edit'


    this.initAddFunction()

  }


  initAddFunction() {
    console.debug("initAddFunction", this.addFunction)

    if (!this.addFunction) this.add = () => this.mainComponent.navigateTo([this.mainComponent.currentModule, 'create'])
   
    else this.add = () => this.mainComponent[this.addFunction]()
    

    
  }


  addFilter(attribute?:AdvancedFiltersInterface, condition?:AdvancedFiltersInterface, inputValue?:any) {
    if (!attribute) attribute = this._attr
    if (!condition) condition = this._condition
    if (!inputValue) inputValue = this._value

    if (attribute.type) inputValue = attribute.type(inputValue)

    let _filter:AdvancedFiltersObjectInterface = {
      'attribute': attribute.key, 
      'condition': condition.key, 
      'value': inputValue,
      '__attribute__': attribute.value,
      '__condition__': condition.value,
      '__value__': inputValue
    }
    this._filters.unshift(_filter)
    this.resetFilterObject()
 
  }


  editFilter(index) {
    this._filters
  }


  removeFilter(index) {
    this._filters = this._filters.filter((element, i) => {
      if (i !== index) return element
    })
  }


  onChangeAttr() {
    this._condition = null
  }


  closeAdvancedFilters() {
    if (this._filters.length) {
      if (!window.confirm('Fechando o filtro avançado você perderá toda a seleção feita anteriormente. Deseja realmente continuar?')) return
    }

    this.resetFilterObject()
    this._filters = []
    this.mainComponent._advancedFilters = null
    this.openAdvancedFilters=false
  }


  get filterConditions() {
    if (!this._attr) return []
    if (this._attr.type === Boolean || this._attr.type === Number) return this._filterConditions.slice(0, 2)

    return this._filterConditions
  }


  /**
   * Função para fazer a busca adequada com o digitar do usuário
   */
  async search() {
    if (this._q) this.mainComponent.q = this._q.trim() 
    
    if (this.filterFunction) {
      this.mainComponent[this.filterFunction]()
    }
    
    else {
      let response = await this.mainComponent.read(this.mainComponent.service, this.mainComponent._apiView)
      this.mainComponent._data = response.results
    }
    
  }


  async searchAdvanced() {
   let advancedFilters = {}

    // Montando: ?... __equal__name = Jose ... 
    this._filters.forEach((element) => {
      advancedFilters[`__${element.condition}__${element.attribute}`] = element.value
    })

    this.mainComponent._advancedFilters = advancedFilters

    let response = await this.mainComponent.read(this.mainComponent.service, this.mainComponent._apiView)
    this.mainComponent._data = response.results

  }


  async clear() {
    this._q = null
    this.mainComponent.q = this._q
    this.search()
  }


  private resetFilterObject() {
    this._attr = null;
    this._condition = null;
    this._value = null;
  }



}
