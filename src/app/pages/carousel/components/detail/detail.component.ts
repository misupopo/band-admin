import {Component, EventEmitter, Input, ViewChild} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailDataService } from './detail.service';
import { DetailModel, UpdateDetailModel } from './detail.model';
import { DateManager} from '../../../../@theme/services';
import { ModalBasicComponent } from '../../../../@theme/components';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { AppConfigService } from "../../../../app.config.service";
import { LoadingSpinnerState } from '../../../../@core/share/loadingSpinner.state';

@Component({
    selector: 'ngx-detail',
    styleUrls: ['./detail.component.scss'],
    templateUrl: './detail.component.html',
})
export class DetailComponent {
    @Input('typeModel') typeModel: string;
    @Input('titleModel') titleModel: string;
    @Input('detailModel') detailModel: string;
    @Input('dateModel') dateModel: string;
    @Input('linkModel') linkModel: string;
    @ViewChild(ModalBasicComponent) modalBasic: ModalBasicComponent;
    @ViewChild('imageLoader') imageLoader: any;
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
    public content: any;
    public fileName: string;
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
                private appConfigService: AppConfigService,
                private loadingSpinnerState: LoadingSpinnerState) {
        this.form = formBuilder.group({
            'type': '',
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

    public onClick(content) {
        this.content = content;
    }

    public onSubmit(values: any): void {
        if (this.form.valid) {
            this.updateDetailData({
                params: {
                    id: this.detailId,
                    type: values.type || this.typeModel,
                    title: values.title,
                    detail: values.detail,
                    date: values.date,
                    link: values.link,
                },
                action: 'carousel/detail',
            }).subscribe((response: any) => {
                if (this.files.length > 0) {
                    const event: any = {
                        type: 'uploadAll',
                        url: this.baseAccessUrl + 'carousel/create/image',
                        method: 'POST',
                        data: {
                            id: response.result._id,
                        },
                    };

                    this.uploadInput.emit(event);
                }

                this.modalBasic.open(this.content, null, 'updateComplete');
            },
            error => {
                this.loadingSpinnerState.setLoadingSpinnerState(false);
            });
        }
    }

    private detailDataLoad() {
        this.getDetailData({
            params: {
                id: this.detailId,
            },
            action: 'carousel/detail',
        }).subscribe((response: any) => {
            const detailData = response.result;

            this.typeModel = detailData.type;
            this.titleModel = detailData.title;
            this.detailModel = detailData.detail;
            this.dateModel = this.dateManager.convertTime(new Date(detailData.date));
            this.linkModel = detailData.link;

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
