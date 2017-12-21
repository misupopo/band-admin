export class DetailModel {
    public params: {
        id: string;
    };
    public action: string;
}

export class UpdateDetailModel {
    public params: {
        id: string;
        title: string;
        date: string;
        information: string;
        enter_time: string;
        start_time: string;
        advance_sale_ticket: number;
        day_ticket: number;
        performer: any;
    };
    public action: string;
}
