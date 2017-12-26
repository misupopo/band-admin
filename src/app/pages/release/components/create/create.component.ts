import { Component, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { CreateDataService } from './create.service';
import { CreateModel } from './create.model';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

@Component({
    selector: 'ngx-create',
    styleUrls: ['./create.component.scss'],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    public form: FormGroup;
    public title: AbstractControl;
    public date: AbstractControl;
    public type: AbstractControl;
    public productNumber: AbstractControl;
    public productTitle: AbstractControl;
    public priceValue: AbstractControl;
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
    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    imagePreview: any;

    constructor(private formBuilder: FormBuilder,
                private createDataService: CreateDataService) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'type': 'single',
            'productNumber': '',
            'productTitle': '',
            'priceValue': '',
        });

        this.title = this.form.controls['title'];
        this.date = this.form.controls['date'];
        this.type = this.form.controls['type'];
        this.productNumber = this.form.controls['productNumber'];
        this.productTitle = this.form.controls['productTitle'];
        this.priceValue = this.form.controls['priceValue'];

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
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

    public onSubmit(values: any): void {
        if (this.form.valid) {

            const discNumber = this.discNumberData.map((data) => {
                return data.value;
            });

            const musicList = this.musicListData.map((data) => {
                return data.musicList;
            });

            // const createData = this.createData({
            //     params: {
            //         title: values.title,
            //         date: values.date,
            //         type: values.type,
            //         product_number: values.productNumber,
            //         disc_number: discNumber,
            //         product_title: values.productTitle,
            //         price_value: values.priceValue,
            //         music_list: musicList,
            //     },
            //     action: 'release/create',
            // }).subscribe((response: any) => {
            // },
            // error => {
            // });

            const event: any = {
                type: 'uploadAll',
                url: 'http://localhost:9001/release/image',
                method: 'POST',
                data: {
                    title: values.title,
                    date: values.date,
                    type: values.type,
                    product_number: values.productNumber,
                    disc_number: discNumber,
                    product_title: values.productTitle,
                    price_value: values.priceValue,
                    music_list: musicList,
                },
            };

            this.uploadInput.emit(event);
        }
    }

    private createData(createModel: CreateModel) {
        return this.createDataService
            .createData(createModel);
    }

    onUploadOutput(output: UploadOutput): void {
        console.log(output);

        if (output.type === 'allAddedToQueue') { // when all files added in queue

        } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
            // add file to array when added
            this.previewImage(output.file.nativeFile).then(response => {
                // The image preview
                this.imagePreview = response;
                this.files.push(output.file);
            });
            // this.files.push(output.file);
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

                console.log(e.target.result);

                resolve(e.target.result);
            }
        });
    }

    startUpload(values): void {
        const event: UploadInput = {
            type: 'uploadAll',
            url: 'http://localhost:9001/release/image',
            method: 'POST',
            data: {
                test: values.title,
            },
        };

        this.uploadInput.emit(event);
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }
}
