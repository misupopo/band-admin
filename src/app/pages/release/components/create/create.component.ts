import {Component, EventEmitter, Input, ViewChild} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { CreateDataService } from './create.service';
import { CreateModel } from './create.model';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { ModalBasicComponent } from "../../../../@theme/components";
import { AppConfigService } from '../../../../app.config.service';

@Component({
    selector: 'ngx-create',
    styleUrls: ['./create.component.scss'],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    @ViewChild('imageLoader') imageLoader: any;
    @ViewChild(ModalBasicComponent) modalBasic: ModalBasicComponent;
    public form: FormGroup;
    public title: AbstractControl;
    public date: AbstractControl;
    public type: AbstractControl;
    public productNumber: AbstractControl;
    public productTitle: AbstractControl;
    public priceValue: AbstractControl;
    public articleTitle: AbstractControl;
    public articleContent: AbstractControl;
    public discTypes = [
        'single',
        'album',
        'mv',
    ];
    public discNumberData = [
        {
            id: 1,
            value: '',
            musicList: [
                '',
            ],
        },
    ];
    public musicListData = [
        {
            id: 1,
            musicList: [
                '',
            ],
        },
    ];
    public content: any;
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
                private appConfigService: AppConfigService) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'type': 'single',
            'productNumber': '',
            'productTitle': '',
            'priceValue': '',
            'articleTitle': '',
            'articleContent': '',
        });

        this.title = this.form.controls['title'];
        this.date = this.form.controls['date'];
        this.type = this.form.controls['type'];
        this.productNumber = this.form.controls['productNumber'];
        this.productTitle = this.form.controls['productTitle'];
        this.priceValue = this.form.controls['priceValue'];
        this.articleTitle = this.form.controls['articleTitle'];
        this.articleContent = this.form.controls['articleContent'];

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

        this.baseAccessUrl = (this.appConfigService.getConfigData().accessUrl + '/');
    }

    public addDiscNumberData() {
        this.discNumberData.push({
            id: (this.discNumberData.length + 1),
            value: '',
            musicList: [
                '',
            ],
        });

        this.musicListData.push({
            id: (this.musicListData.length + 1),
            musicList: [
                '',
            ],
        });
    }

    public removeDiscNumberData() {
        if (this.discNumberData.length <= 1) {
            return;
        }
        this.discNumberData.pop();
        this.musicListData.pop();
    }

    public changValue(value, id) {
        const discNumberData = this.discNumberData;
        const index = this.discNumberData.findIndex((data) => {
            return data.id === id;
        });

        discNumberData[index].value = value;
    }

    public addMusicListData(id) {
        const index = this.discNumberData.findIndex((data) => {
            return data.id === id;
        });

        this.discNumberData[index].musicList.push('');
        this.musicListData[index].musicList.push('');
    }

    public removeMusicListData(id) {
        const index = this.discNumberData.findIndex((data) => {
            return data.id === id;
        });

        if (this.discNumberData[index].musicList.length <= 1) {
            return;
        }

        this.discNumberData[index].musicList.pop();
        this.musicListData[index].musicList.pop();
    }

    public changMusicListValue(value, discNumberId, musicListIndex) {
        const musicListData = this.discNumberData;
        const index = musicListData.findIndex((data) => {
            return data.id === discNumberId;
        });

        // discNumberDataと同じ変数にしてしまうとなぜかネストのinputの挙動がおかしい
        this.musicListData[index].musicList[musicListIndex] = value;
    }

    public onClick(content) {
        this.content = content;
    }

    public onSubmit(values: any): void {
        if (this.form.valid) {

            const discNumber = this.discNumberData.map((data) => {
                return data.value;
            });

            const musicList = this.musicListData.map((data) => {
                return data.musicList;
            });

            this.createData({
                params: {
                    title: values.title,
                    date: values.date,
                    type: values.type,
                    product_number: values.productNumber,
                    disc_number: discNumber,
                    product_title: values.productTitle,
                    price_value: values.priceValue,
                    music_list: musicList,
                    article_title: values.articleTitle,
                    article_content: values.articleContent,
                },
                action: 'release/create',
            }).subscribe((response: any) => {
                const event: any = {
                    type: 'uploadAll',
                    url: this.baseAccessUrl + 'release/create/image',
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
