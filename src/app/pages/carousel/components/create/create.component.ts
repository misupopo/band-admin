import { Component, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { CreateDataService } from './create.service';
import { CreateModel } from './create.model';
import { ModalBasicComponent } from "../../../../@theme/components";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { AppConfigService } from "../../../../app.config.service";
import { LoadingSpinnerState } from '../../../../@core/share/loadingSpinner.state'

@Component({
    selector: 'ngx-create',
    styleUrls: ['./create.component.scss'],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    @ViewChild('imageLoader') imageLoader: any;
    @Input('content') content: any;
    @ViewChild(ModalBasicComponent) modalBasic: ModalBasicComponent;
    public form: FormGroup;
    public type: AbstractControl;
    public title: AbstractControl;
    public detail: AbstractControl;
    public date: AbstractControl;
    public link: AbstractControl;
    public bannerTypes = [
        'banner',
        'release',
    ];
    private baseAccessUrl: string;
    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    imagePreview: any;

    constructor(private formBuilder: FormBuilder,
                private createDataService: CreateDataService,
                private appConfigService: AppConfigService,
                private loadingSpinnerState: LoadingSpinnerState) {
        this.form = formBuilder.group({
            'type': 'banner',
            'title': '',
            'detail': '',
            'date': '',
            'link': '',
        });

        this.type = this.form.controls['type'];
        this.title = this.form.controls['title'];
        this.detail = this.form.controls['detail'];
        this.date = this.form.controls['date'];
        this.link = this.form.controls['link'];

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

        this.baseAccessUrl = (this.appConfigService.getConfigData().accessUrl + '/');
    }

    public onSubmit(values: any): void {
        this.createData({
            params: {
                type: values.type,
                title: values.title,
                detail: values.detail,
                date: values.date,
                link: values.link,
            },
            action: 'carousel/create',
        }).subscribe((response: any) => {
            const event: any = {
                type: 'uploadAll',
                url: this.baseAccessUrl + 'carousel/create/image',
                method: 'POST',
                data: {
                    id: response.result.insertedIds[0],
                },
            };

            this.uploadInput.emit(event);
            this.modalBasic.open(this.content, null, 'createComplete');
        },
        error => {
            this.loadingSpinnerState.setLoadingSpinnerState(false);
        });
    }

    public onClick(content) {
        this.content = content;
    }

    onUploadOutput(output: UploadOutput): void {
        // when all files added in queue
        if (output.type === 'allAddedToQueue') {

        } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            // add file to array when added
            this.previewImage(output.file.nativeFile).then(response => {
                // The image preview
                this.imagePreview = response;
                this.files.push(output.file);
            });
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
            // update current data in files array for uploading file
            const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
            this.files[index] = output.file;
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        }
    }

    private createData(createModel: CreateModel) {
        return this.createDataService
            .createData(createModel);
    }

    previewImage(file: any) {
        const fileReader = new FileReader();
        return new Promise(resolve => {
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e: any) {
                resolve(e.target.result);
            };
        });
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
        this.imagePreview = null;
        this.imageLoader.nativeElement.value = '';
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }
}
