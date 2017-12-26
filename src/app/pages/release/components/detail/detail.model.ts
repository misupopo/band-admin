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
        type: string;
        product_number: string;
        disc_number: any;
        product_title: string;
        price_value: number;
        music_list: any;
        article_title: string;
        article_content: string;
        file_name: string;
    };
    public action: string;
}
