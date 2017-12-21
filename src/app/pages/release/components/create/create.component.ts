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
                return data.value
            });

            const musicList = this.musicListData.map((data) => {
                return data.musicList;
            });

            this.createData({
                params: {
                    title: values.title,
                    date: values.date,
                    type: values.type,
                    product_number: values.productNumber,
                    disc_number: discNumber,
                    product_title: values.productTitle,
                    price: values.price,
                    music_list: musicList,
                },
                action: 'release/create',
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
