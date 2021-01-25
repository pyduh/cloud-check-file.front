import { Component, OnInit, Input, ViewChild } from '@angular/core';


@Component({
    selector: 'app-initials-icon',
    templateUrl: './initials-icon.html',
    styleUrls: ['./initials-icon.scss']
})
export class InitialsIconComponent implements OnInit {

    @Input() data: string
    @Input() type: string = 'icon'
    @Input() width: string = '32px'
    @Input() height: string = '32px'

    initials:string
    circleColor:string
    
    colors = ['#EB7181', '#468547', '#3670B2'] //'#FFD558'


    constructor() { }


    ngOnInit() { 
        const aleatoryIndex = Math.floor(Math.random() * Math.floor(this.colors.length))
        this.circleColor = this.colors[aleatoryIndex]
        this.createInitials()

    }


    createInitials = () => {
        if (!(this.data && this.data !== '')) {
            throw new Error("Verifique a validade do atributo data")
        } 

        let initials = ''

        if (this.data.split(' ').length === 2) {
            initials = `${this.data.split(' ')[0].charAt(0)}${this.data.split(' ')[1].charAt(0)}`
        }

        else {
            initials = `${this.data.split(' ')[0].charAt(0)}${this.data.split(' ')[0].charAt(1)}`
        }

        initials = initials.toUpperCase()

        this.initials = initials
    }

}
