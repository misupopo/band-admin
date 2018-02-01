import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ModalState {
    public modalData = new Subject<Object>();

    constructor() {
        this.modalData['Ref'] = null;
    }

    public setModalRefData (content, event, switchData) {
        this.modalData['Ref'] = content;
        this.modalData.next({
            data: event,
            switchData: switchData
        });
    }

    public setModalOpen () {
        this.modalData['Ref'].open();
    }

    public setModalClose () {
        this.modalData['Ref'].close();
    }
}
