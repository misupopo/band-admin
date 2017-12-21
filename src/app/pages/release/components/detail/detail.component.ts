import { Component, Input } from '@angular/core';
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
export class DetailComponent {
    @Input('titleModel') titleModel: string;
    @Input('dateModel') dateModel: string;
    @Input('informationModel') informationModel: string;
    @Input('enterTimeModel') enterTimeModel: string;
    @Input('startTimeModel') startTimeModel: string;
    @Input('advanceSaleTicketModel') advanceSaleTicketModel: string;
    @Input('dayTicketModel') dayTicketModel: string;
    @Input('performerModel') performerModel: string;
    public form: FormGroup;
    public title: AbstractControl;
    public date: AbstractControl;
    public information: AbstractControl;
    public enterTime: AbstractControl;
    public startTime: AbstractControl;
    public advanceSaleTicket: AbstractControl;
    public dayTicket: AbstractControl;
    public performer: AbstractControl;
    private detailId: string;

    constructor(private detailDataService: DetailDataService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private dateManager: DateManager) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'information': '',
            'enterTime': '',
            'startTime': '',
            'advanceSaleTicket': '',
            'dayTicket': '',
            'performer': '',
        });

        this.title = this.form.controls['title'];
        this.date = this.form.controls['date'];
        this.information = this.form.controls['information'];
        this.enterTime = this.form.controls['enterTime'];
        this.startTime = this.form.controls['startTime'];
        this.advanceSaleTicket = this.form.controls['advanceSaleTicket'];
        this.dayTicket = this.form.controls['dayTicket'];
        this.performer = this.form.controls['performer'];

        this.activatedRoute.params.subscribe((param: any) => {
            this.detailId = param.id;

            this.getDetailData({
                params: {
                    id: this.detailId,
                },
                action: 'live/detail',
            }).subscribe((response: any) => {
                const detailData = response.result;

                this.titleModel = detailData.title;
                this.dateModel = this.dateManager.convertTime(new Date(detailData.date));
                this.informationModel = detailData.information;
                this.enterTimeModel = this.dateManager.convertTime(new Date(detailData.enter_time));
                this.startTimeModel = this.dateManager.convertTime(new Date(detailData.start_time));
                this.advanceSaleTicketModel = detailData.advance_sale_ticket;
                this.dayTicketModel = detailData.day_ticket;

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
        });
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
                    information: values.information,
                    enter_time: values.enterTime,
                    start_time: values.startTime,
                    advance_sale_ticket: values.advanceSaleTicket,
                    day_ticket: values.dayTicket,
                    performer: performers,
                },
                action: 'live/detail',
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
