import {Component, ViewChild, Input, EventEmitter} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { CreateDataService } from './create.service';
import { CreateModel } from './create.model';
import { ModalBasicComponent } from "../../../../@theme/components";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { AppConfigService } from "../../../../app.config.service";

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
    public title: AbstractControl;
    public date: AbstractControl;
    public articleTitle: AbstractControl;
    public articleContent: AbstractControl;
    private baseAccessUrl: string;
    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    imagePreview = [];

    constructor(private formBuilder: FormBuilder,
                private createDataService: CreateDataService,
                private appConfigService: AppConfigService) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'articleTitle': '',
            'articleContent': '',
        });

        this.title = this.form.controls['title'];
        this.date = this.form.controls['date'];
        this.articleTitle = this.form.controls['articleTitle'];
        this.articleContent = this.form.controls['articleContent'];

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

        this.baseAccessUrl = (this.appConfigService.getConfigData().accessUrl + '/');
    }

    public onClick(content) {
        this.content = content;
    }

    public onSubmit(values: any): void {
        if (this.form.valid) {

            this.createData({
                params: {
                    title: values.title,
                    date: values.date,
                    article_title: values.articleTitle,
                    article_content: values.articleContent,
                },
                action: 'info/create',
            }).subscribe((response: any) => {
                    const event: any = {
                        type: 'uploadAll',
                        url: this.baseAccessUrl + 'info/create/image',
                        method: 'POST',
                        data: {
                            id: response.result.insertedIds[0],
                        },
                    };

                    this.uploadInput.emit(event);
                    this.modalBasic.open(this.content, null, 'createComplete');
            },
            error => {
            });
        }
    }

    private createData(createModel: CreateModel) {
        return this.createDataService
            .createData(createModel);
    }

    onUploadOutput(output: UploadOutput): void {
        // when all files added in queue
        if (output.type === 'allAddedToQueue') {

        } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
            // add file to array when added
            this.previewImage(output.file.nativeFile).then(response => {
                // The image preview
                this.imagePreview.push(response);
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

    removeFile(id: string, index?: string): void {
        const targetIndex = parseInt(index, 10);

        this.uploadInput.emit({ type: 'remove', id: id });
        this.imagePreview.splice(targetIndex, 1);
        this.imageLoader.nativeElement.value = '';
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }
}
