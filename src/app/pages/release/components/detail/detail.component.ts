import {Component, Input, AfterViewInit, ViewChild, EventEmitter} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailDataService } from './detail.service';
import { DetailModel, UpdateDetailModel } from './detail.model';
import { DateManager} from '../../../../@theme/services';
import { ModalBasicComponent } from "../../../../@theme/components";
import { AppConfigService } from '../../../../app.config.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

@Component({
    selector: 'ngx-detail',
    styleUrls: ['./detail.component.scss'],
    templateUrl: './detail.component.html',
})
export class DetailComponent {
    @Input('titleModel') titleModel: string;
    @Input('dateModel') dateModel: string;
    @Input('typeModel') typeModel: string;
    @Input('productNumberModel') productNumberModel: string;
    @Input('productTitleModel') productTitleModel: string;
    @Input('priceValueModel') priceValueModel: string;
    @Input('musicDataModel') musicDataModel: any;
    @Input('articleTitleModel') articleTitleModel: any;
    @Input('articleContentModel') articleContentModel: any;
    @ViewChild(ModalBasicComponent) modalBasic: ModalBasicComponent;
    @ViewChild('imageLoader') imageLoader: any;
    public form: FormGroup;
    public title: AbstractControl;
    public date: AbstractControl;
    public type: AbstractControl;
    public productNumber: AbstractControl;
    public productTitle: AbstractControl;
    public priceValue: AbstractControl;
    public articleTitle: AbstractControl;
    public articleContent: AbstractControl;
    public discNumberDataModel: any;
    public musicListDataModel: any;
    public musicListData: any;
    public fileName: string;
    public content: any;
    private detailId: string;
    private baseImageUrl: string;
    private baseAccessUrl: string;
    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    imagePreview: any;

    constructor(private detailDataService: DetailDataService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private dateManager: DateManager,
                private appConfigService: AppConfigService) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'type': '',
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

        this.activatedRoute.params.subscribe((param: any) => {
            this.detailId = param.id;
            this.detailDataLoad();
        });

        this.baseImageUrl = (this.appConfigService.getConfigData().accessUrl + '/images/');
        this.baseAccessUrl = (this.appConfigService.getConfigData().accessUrl + '/');

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    public changValue(value, index) {
        this.discNumberDataModel[index] = value;
    }

    public addDiscNumberData() {
        this.discNumberDataModel.push('');
        this.musicListDataModel.push(['']);
        this.musicListData.push(['']);
    }

    public removeDiscNumberData() {
        if (this.discNumberDataModel.length <= 1) {
            return;
        }
        this.discNumberDataModel.pop();
        this.musicListDataModel.pop();
        this.musicListData.pop();
    }

    public addMusicListData(musicListIndex) {
        this.musicListDataModel[musicListIndex].push('');
        this.musicListData[musicListIndex].push('');
    }

    public removeMusicListData(musicListIndex) {
        if (this.musicListDataModel[musicListIndex].length <= 1) {
            return;
        }
        this.musicListDataModel[musicListIndex].pop();
        this.musicListData[musicListIndex].pop();
    }

    public changMusicListValue(value, musicListIndex, musicIndex) {
        this.musicListData[musicListIndex][musicIndex] = value;
    }

    public onClick(content) {
        this.content = content;
    }

    public onSubmit(values: any): void {
        if (this.form.valid) {
            this.updateDetailData({
                params: {
                    id: this.detailId,
                    title: values.title,
                    date: values.date,
                    type: values.type,
                    product_number: values.productNumber,
                    product_title: values.productTitle,
                    price_value: values.priceValue,
                    disc_number: this.discNumberDataModel,
                    music_list: this.musicListData,
                    article_title: this.articleTitleModel,
                    article_content: this.articleContentModel,
                    file_name: this.fileName,
                },
                action: 'release/detail',
            }).subscribe((response: any) => {
                const event: any = {
                    type: 'uploadAll',
                    url: this.baseAccessUrl + 'release/create/image',
                    method: 'POST',
                    data: {
                        id: response.result[0]._id,
                    },
                };

                this.uploadInput.emit(event);

                this.modalBasic.open(this.content, null, 'updateComplete');
            },
            error => {
            });
        }
    }

    private detailDataLoad() {
        this.getDetailData({
            params: {
                id: this.detailId,
            },
            action: 'release/detail',
        }).subscribe((response: any) => {
            const detailData = response.result;

            this.titleModel = detailData.title;
            this.dateModel = this.dateManager.convertTime(new Date(detailData.date));
            this.typeModel = detailData.type;
            this.productNumberModel = detailData.product_number;
            this.productTitleModel = detailData.product_title;
            this.priceValueModel = detailData.price_value;
            this.discNumberDataModel = detailData.disc_number;
            this.musicListDataModel = detailData.music_list;
            this.musicListData = detailData.music_list.map((data) => {
                return Object.assign([], data);
            });

            this.articleTitleModel = detailData.article_title;
            this.articleContentModel = detailData.article_content;
            this.fileName = detailData.file_name;
        });
    }

    private getDetailData(detailModel: DetailModel) {
        return this.detailDataService
            .getDetailData(detailModel);
    }

    private updateDetailData(updateDetailModel: UpdateDetailModel) {
        return this.detailDataService
            .updateDetailData(updateDetailModel);
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
