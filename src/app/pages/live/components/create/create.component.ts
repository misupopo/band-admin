import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { CreateDataService } from './create.service';
import { CreateModel } from './create.model';

@Component({
    selector: 'ngx-create',
    styleUrls: ['./create.component.scss'],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    public form: FormGroup;
    public title: AbstractControl;
    public date: AbstractControl;
    public information: AbstractControl;
    public time: AbstractControl;
    public ticket: AbstractControl;
    public performer: AbstractControl;

    constructor(private formBuilder: FormBuilder,
                private createDataService: CreateDataService) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'information': '',
            'time': '',
            'ticket': '',
            'performer': '',
        });

        this.title = this.form.controls['title'];
        this.date = this.form.controls['date'];
        this.information = this.form.controls['information'];
        this.time = this.form.controls['time'];
        this.ticket = this.form.controls['ticket'];
        this.performer = this.form.controls['performer'];
    }

    public onSubmit(values: any): void {
        if (this.form.valid) {
            this.createData({
                params: {
                    title: values.title,
                    date: values.date,
                    information: values.information,
                    time: values.time,
                    ticket: values.ticket,
                    performer: values.performer,
                },
                action: 'live/create',
            }).subscribe((response: any) => {
            },
            error => {
            });
        }
    }

    private createData(createModel: CreateModel) {
        return this.createDataService
            .createData(createModel);
    }
}
