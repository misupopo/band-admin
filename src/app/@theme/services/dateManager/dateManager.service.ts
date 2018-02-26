import { Injectable } from '@angular/core';
import { sprintf } from 'sprintf-js';
import * as moment from 'moment';

@Injectable()
export class DateManager {
    public allListConvert(list) {
        return list.reduce((collection, data) => {
            const margeData: any = {
                date: this.convertTime(new Date(data.date)),
                enterTime: this.convertTime(new Date(data.enterTime)),
                startTime: this.convertTime(new Date(data.startTime)),
                createAt: this.convertTime(new Date(data.createAt)),
                updateAt: this.convertTime(new Date(data.updateAt)),
            };

            collection.push(Object.assign(data, margeData));

            return collection;
        }, []);
    }

    public convertTime(timeValue: Date) {

        // return moment(timeValue).utc().format('YYYY/MM/DD HH:mm:ss');
        return moment(timeValue).format('YYYY/MM/DD HH:mm:ss');

        // return sprintf('%d/%d/%d %02d:%02d:%02d',
        //     timeValue.getFullYear(),
        //     (timeValue.getMonth() + 1),
        //     timeValue.getDate(),
        //     timeValue.getHours(),
        //     timeValue.getMinutes(),
        //     timeValue.getSeconds());
    }
}
