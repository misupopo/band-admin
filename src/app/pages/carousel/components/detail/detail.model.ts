export class DetailModel {
    public params: {
        id: string;
    };
    public action: string;
}

export class UpdateDetailModel {
    public params: {
        id: string;
        type: string;
        title: string;
        detail: string;
        date: string;
        link: string;
    };
    public action: string;
}
