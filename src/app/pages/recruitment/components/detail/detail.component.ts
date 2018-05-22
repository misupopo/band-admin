import {Component, Input, ViewChild} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailDataService } from './detail.service';
import { DetailModel, UpdateDetailModel, UpdatePm2DetailModel } from './detail.model'
import { DateManager} from '../../../../@theme/services';
import { ModalBasicComponent } from "../../../../@theme/components";
import { LoadingSpinnerState } from '../../../../@core/share/loadingSpinner.state';

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
    public content: any;
    public redisData: any = null;
    public pm2Data: any = null;
    public pm2ChangeSendValue = {
        appName: null,
        status: null
    };

    constructor(private detailDataService: DetailDataService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private dateManager: DateManager,
                private loadingSpinnerState: LoadingSpinnerState) {
        this.detailDataLoad();
    }

    public onClick(content) {
        this.content = content;
    }

    public onSubmit(): void {
        const sendData = {};

        this.redisData.map((data) => {
            sendData[data.key] = data.value;
        });

        this.updateDetailData({
            params: {
                setData: sendData
            },
            action: 'recruitment/set',
        }).subscribe((response: any) => {
            this.modalBasic.open(this.content, null, 'updateComplete');
        },
        error => {
            this.loadingSpinnerState.setLoadingSpinnerState(false);
        });
    }

    public onChangePm2Status(): void {
        if (this.pm2ChangeSendValue.status === null) {
            return;
        }

        if (this.pm2ChangeSendValue.status !== this.pm2Data[this.pm2ChangeSendValue.appName].status) {
            this.updatePm2DetailData({
                params: {
                    appName: this.pm2ChangeSendValue.appName,
                    status: this.pm2ChangeSendValue.status
                },
                action: 'recruitment/pm2Set',
            }).subscribe((response: any) => {
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
            },
            action: 'recruitment/list',
        }).subscribe((response: any) => {
            this.redisData = [];
            const formGroupData = {};

            Object.keys(response.result).map((key) => {
                formGroupData[key] = '';

                this.redisData.push({
                    key: key,
                    value: response.result[key]
                });
            });

            this.pm2Data = response.pm2;

            this.form = this.formBuilder.group(formGroupData);
        },
        error => {
            this.loadingSpinnerState.setLoadingSpinnerState(false);
        });
    }

    onValueChange(key, event) {
        this.redisData.some((data, index) => {
            if (data.key === key) {
                this.redisData[index].value = event.target.value;
                return true;
            }
        });
    }

    onPm2ValueChange(key, event) {
        this.pm2ChangeSendValue = {
            appName: key,
            status: event.target.value
        };
    }

    private getDetailData(detailModel: DetailModel) {
        return this.detailDataService
            .getDetailData(detailModel);
    }

    private updateDetailData(updateDetailModel: UpdateDetailModel) {
        return this.detailDataService
            .updateDetailData(updateDetailModel);
    }

    private updatePm2DetailData(updatePm2DetailModel: UpdatePm2DetailModel) {
        return this.detailDataService
            .updatePm2DetailData(updatePm2DetailModel);
    }
}
