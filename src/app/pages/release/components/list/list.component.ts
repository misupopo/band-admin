import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ListDataService } from './list.service';
import { ListModel, RemoveListModel } from './list.model';
import { CamelcaseConverter, DateManager} from '../../../../@theme/services';
import { ModalBasicComponent } from '../../../../@theme/components/';

@Component({
    selector: 'ngx-list',
    styleUrls: ['./list.component.scss'],
    templateUrl: './list.component.html',
})
export class ListComponent {

    @ViewChild(ModalBasicComponent) modalBasic: ModalBasicComponent;

    public settings = {
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
        },
        columns: {
            title: {
                title: 'タイトル',
                type: 'string',
            },
            date: {
                title: 'リリース日',
                type: 'string',
            },
            type: {
                title: 'タイプ',
                type: 'string',
            },
            productNumber: {
                title: 'プロダクトナンバー',
                type: 'string',
            },
            productTitle: {
                title: 'プロダクトタイトル',
                type: 'string',
            },
            priceValue: {
                title: '値段',
                type: 'number',
            },
        },
    };
    public source: LocalDataSource = new LocalDataSource();
    public popUpContent;

    constructor(private listDataService: ListDataService,
                private camelcaseConverter: CamelcaseConverter,
                private dateManager: DateManager,
                private router: Router) {
        this.listDataLoad();
    }

    public onDeleteConfirm(content, event): void {
        this.popUpContent = content;
        this.modalBasic.open(content, event.data, 'listRemove');
    }

    public onCompleteConfirm(): void {
        this.modalBasic.open(this.popUpContent, null, 'listRemoveComplete');
    }

    public onUserSelectRow(userData) {
        this.router.navigate([`/pages/release/detail/${userData.data.id}/`]);
    }

    public listRemove(data) {
        this.removeListData({
            params: {
                id: data.id
            },
            action: 'release/remove',
        }).subscribe((response: any) => {
            this.modalBasic.close();
            this.onCompleteConfirm();
            this.listDataLoad();
        },
        error => {
        });
    }

    private listDataLoad() {
        this.getListData({
            params: {
            },
            action: 'release/list',
        }).subscribe((response: any) => {
            const result = response.result.map((listData) => {
                const returnData = {};

                Object.keys(listData).forEach((key) => {
                    returnData[this.camelcaseConverter.convertForCamelcase(key)] = listData[key];
                });

                return returnData;
            });

            this.source.load(this.dateManager.allListConvert(result));
        },
        error => {
        });
    }

    private getListData(listModel: ListModel) {
        return this.listDataService
            .getListData(listModel);
    }

    private removeListData(removeListModel: RemoveListModel) {
        return this.listDataService
            .removeListData(removeListModel);
    }
}
