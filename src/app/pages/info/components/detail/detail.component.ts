import {Component, EventEmitter, Input, ViewChild} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailDataService } from './detail.service';
import { DetailModel, UpdateDetailModel } from './detail.model';
import { DateManager} from '../../../../@theme/services';
import { ModalBasicComponent } from "../../../../@theme/components";
import { AppConfigService } from "../../../../app.config.service";
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput} from "ngx-uploader";

@Component({
    selector: 'ngx-detail',
    styleUrls: ['./detail.component.scss'],
    templateUrl: './detail.component.html',
})
export class DetailComponent {
    @ViewChild('imageLoader') imageLoader: any;
    @Input('titleModel') titleModel: string;
    @Input('dateModel') dateModel: string;
    @Input('articleTitleModel') articleTitleModel: any;
    @Input('articleContentModel') articleContentModel: any;
    @ViewChild(ModalBasicComponent) modalBasic: ModalBasicComponent;
    public form: FormGroup;
    public title: AbstractControl;
    public date: AbstractControl;
    public articleTitle: AbstractControl;
    public articleContent: AbstractControl;
    public content: any;
    public detailImage: any;
    private detailId: string;
    private baseImageUrl: string;
    private baseAccessUrl: string;
    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    imagePreview = [];

    constructor(private detailDataService: DetailDataService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private dateManager: DateManager,
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

        this.activatedRoute.params.subscribe((param: any) => {
            this.detailId = param.id;
            this.detailDataLoad();
        });

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

        this.baseImageUrl = (this.appConfigService.getConfigData().accessUrl + '/images/');
        this.baseAccessUrl = (this.appConfigService.getConfigData().accessUrl + '/');
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
                    article_title: this.articleTitleModel,
                    article_content: this.articleContentModel,
                    file_name: this.detailImage
                },
                action: 'info/detail',
            }).subscribe((response: any) => {
                const event: any = {
                    type: 'uploadAll',
                    url: this.baseAccessUrl + 'info/create/image',
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

    public removeUploadedImage(imageData) {
        let removeIndex;

        this.detailImage.forEach((data, index) => {
            if (data.filename === imageData.filename) {
                removeIndex = index;
            }
        });

        this.detailImage.splice(removeIndex, 1);
    }

    private detailDataLoad() {
        this.getDetailData({
            params: {
                id: this.detailId,
            },
            action: 'info/detail',
        }).subscribe((response: any) => {
            const detailData = response.result;

            this.titleModel = detailData.title;
            this.dateModel = this.dateManager.convertTime(new Date(detailData.date));
            this.articleTitleModel = detailData.article_title;
            this.articleContentModel = detailData.article_content;
            this.detailImage = detailData.file_name ? detailData.file_name : [];
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
