import { Component, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalState } from '../../../@core/share/modal.state';

@Component({
    selector: 'ngbd-modal-content',
    styleUrls: ['./modalContent.component.scss'],
    templateUrl: './modalContent.component.html'
})
export class ModalContentComponent {
    @Input('content') content: any;
    @Output() listRemove = new EventEmitter();
    public displayData: any = {};
    public contentSwitch: string = '';

    constructor(private modalState: ModalState) {
        const subscribeData = this.modalState.modalData.subscribe((data: any) => {
            this.displayData = data.data;
            this.contentSwitch = data.switchData;
            subscribeData.unsubscribe();
        });
    }

    public close () {
        this.modalState.setModalClose();
    }

    public eventEmitAction(emitData) {
        this[emitData].emit(this.displayData);
    }
}
