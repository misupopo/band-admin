import {Component, Input, ViewChild} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailDataService } from './detail.service';
import { DetailModel, UpdateDetailModel } from './detail.model';
import { DateManager} from '../../../../@theme/services';
import { ModalBasicComponent } from "../../../../@theme/components";

@Component({
    selector: 'ngx-detail',
    styleUrls: ['./detail.component.scss'],
    templateUrl: './detail.component.html',
})
export class DetailComponent {
    @Input('titleModel') titleModel: string;
    @Input('dateModel') dateModel: string;
    @Input('venueModel') venueModel: string;
    @Input('informationModel') informationModel: string;
    @Input('enterTimeModel') enterTimeModel: string;
    @Input('startTimeModel') startTimeModel: string;
    @Input('advanceSaleTicketModel') advanceSaleTicketModel: string;
    @Input('dayTicketModel') dayTicketModel: string;
    @Input('performerModel') performerModel: string;
    @Input('articleTitleModel') articleTitleModel: any;
    @Input('articleContentModel') articleContentModel: any;
    @ViewChild(ModalBasicComponent) modalBasic: ModalBasicComponent;
    public form: FormGroup;
    public title: AbstractControl;
    public date: AbstractControl;
    public venue: AbstractControl;
    public information: AbstractControl;
    public enterTime: AbstractControl;
    public startTime: AbstractControl;
    public advanceSaleTicket: AbstractControl;
    public dayTicket: AbstractControl;
    public performer: AbstractControl;
    public articleTitle: AbstractControl;
    public articleContent: AbstractControl;
    public content: any;
    private detailId: string;

    constructor(private detailDataService: DetailDataService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private dateManager: DateManager) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'venue': '',
            'information': '',
            'enterTime': '',
            'startTime': '',
            'advanceSaleTicket': '',
            'dayTicket': '',
            'performer': '',
            'articleTitle': '',
            'articleContent': '',
        });

        this.title = this.form.controls['title'];
        this.date = this.form.controls['date'];
        this.venue = this.form.controls['venue'];
        this.information = this.form.controls['information'];
        this.enterTime = this.form.controls['enterTime'];
        this.startTime = this.form.controls['startTime'];
        this.advanceSaleTicket = this.form.controls['advanceSaleTicket'];
        this.dayTicket = this.form.controls['dayTicket'];
        this.performer = this.form.controls['performer'];
        this.articleTitle = this.form.controls['articleTitle'];
        this.articleContent = this.form.controls['articleContent'];

        this.activatedRoute.params.subscribe((param: any) => {
            this.detailId = param.id;
            this.detailDataLoad();
        });
    }

    public onClick(content) {
        this.content = content;
    }

    public onSubmit(values: any): void {
        if (this.form.valid) {
            const performers = values.performer.split(', ').reduce((collection, performerData) => {
                collection.push(performerData);
                return collection;
            }, []);

            this.updateDetailData({
                params: {
                    id: this.detailId,
                    title: values.title,
                    date: values.date,
                    venue: values.venue,
                    information: values.information,
                    enter_time: values.enterTime,
                    start_time: values.startTime,
                    advance_sale_ticket: values.advanceSaleTicket,
                    day_ticket: values.dayTicket,
                    performer: performers,
                    article_title: this.articleTitleModel,
                    article_content: this.articleContentModel,
                },
                action: 'live/detail',
            }).subscribe((response: any) => {
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
            action: 'live/detail',
        }).subscribe((response: any) => {
            const detailData = response.result;

            this.titleModel = detailData.title;
            this.dateModel = this.dateManager.convertTime(new Date(detailData.date));
            this.venueModel = detailData.venue;
            this.informationModel = detailData.information;
            this.enterTimeModel = this.dateManager.convertTime(new Date(detailData.enter_time));
            this.startTimeModel = this.dateManager.convertTime(new Date(detailData.start_time));
            this.advanceSaleTicketModel = detailData.advance_sale_ticket;
            this.dayTicketModel = detailData.day_ticket;
            this.articleTitleModel = detailData.article_title;
            this.articleContentModel = detailData.article_content;

            let performers = '';

            detailData.performer.map((value) => {
                if (performers) {
                    performers = (performers + ', ' + value);
                } else {
                    performers = value;
                }
            });

            this.performerModel = performers;
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
}
