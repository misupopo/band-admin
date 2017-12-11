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
    public enter_time: AbstractControl;
    public start_time: AbstractControl;
    public advance_sale_ticket: AbstractControl;
    public day_ticket: AbstractControl;
    public performer: AbstractControl;

    constructor(private formBuilder: FormBuilder,
                private createDataService: CreateDataService) {
        this.form = formBuilder.group({
            'title': '',
            'date': '',
            'information': '',
            'enter_time': '',
            'start_time': '',
            'advance_sale_ticket': '',
            'day_ticket': '',
            'performer': '',
        });

        this.title = this.form.controls['title'];
        this.date = this.form.controls['date'];
        this.information = this.form.controls['information'];
        this.enter_time = this.form.controls['enter_time'];
        this.start_time = this.form.controls['start_time'];
        this.advance_sale_ticket = this.form.controls['advance_sale_ticket'];
        this.day_ticket = this.form.controls['day_ticket'];
        this.performer = this.form.controls['performer'];
    }

    public onSubmit(values: any): void {
        if (this.form.valid) {

            const performers = values.performer.split(', ').reduce((collection, performerData) => {
                collection.push(performerData);
                return collection;
            }, []);

            this.createData({
                params: {
                    title: values.title,
                    date: values.date,
                    information: values.information,
                    enter_time: values.enter_time,
                    start_time: values.start_time,
                    advance_sale_ticket: values.advance_sale_ticket,
                    day_ticket: values.day_ticket,
                    performer: performers,
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
