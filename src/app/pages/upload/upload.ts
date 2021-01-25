import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";


@Component({
    selector: "app-upload",
    templateUrl: "./upload.html",
    styleUrls: ["./upload.scss"],
})
export class UploadComponent implements OnInit {
    @ViewChild('fileDropRef') fileDropEl: ElementRef;
    @Input() acceptFiles: string[] = ['.png', '.jpeg', '.jpg']

    file: any = null;
    progress: number = 0

    constructor() { }


    ngOnInit() { }


    onFileDropped($event) {
        if ((Object.values($event).length) > 1)
            throw new Error(`Somente permitido um arquivo.`)

        Object.values($event).forEach((file: File) => {
            if (!this.isAcceptable(file.name))
                throw new Error(`Formato de arquivo não aceito: ${file.name}`)
        })

        this.file = $event[0]
        this.file.progress = 0
        
        this.fileDropEl.nativeElement.value = "";

    }


    onRemoveFile() {
        this.reset()
    }


    reset() {
        this.file = null
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


    changeState(index: number, array: Array<any>) {
        array.forEach((element, i) => {
            if (index === i) return

            element.flag = false
        })
    }

    
    private isAcceptable(name: string): boolean {
        if (this.acceptFiles.includes(`.${this.getExtension(name)}`)) return true
        return false
    }


    private getExtension(fileName: string): string {
        let extension: any = fileName.split('.')
        extension = extension[extension.length - 1]

        return extension

    }



}
