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
        article_title: string;
        article_content: string;
        file_name: any;
    };
    public action: string;
}
