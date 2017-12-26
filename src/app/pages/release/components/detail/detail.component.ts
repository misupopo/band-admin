import { Component, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailDataService } from './detail.service';
import { DetailModel, UpdateDetailModel } from './detail.model';
import { DateManager} from '../../../../@theme/services';

@Component({
    selector: 'ngx-detail',
    styleUrls: ['./detail.component.scss'],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements AfterViewInit {
    @Input('titleModel') titleModel: string;
    @Input('dateModel') dateModel: string;
    @Input('typeModel') typeModel: string;
    @Input('productNumberModel') productNumberModel: string;
    @Input('productTitleModel') productTitleModel: string;
    @Input('priceValueModel') priceValueModel: string;
    @Input('musicDataModel') musicDataModel: any;
    @Input('articleTitleModel') articleTitleModel: any;
    @Input('articleContentModel') articleContentModel: any;
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
    private detailId: string;

    constructor(private detailDataService: DetailDataService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private dateManager: DateManager) {
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
    }

    ngAfterViewInit() {
        this.activatedRoute.params.subscribe((param: any) => {
            this.detailId = param.id;

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
        });
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
            },
            error => {
            });
        }
    }

    private getDetailData(detailModel: DetailModel) {
        return this.detailDataService
            .getDetailData(detailModel);
    }

    private updateDetailData(updateDetailModel: UpdateDetailModel) {
        return this.detailDataService
            .updateDetailData(updateDetailModel);
    }
}
