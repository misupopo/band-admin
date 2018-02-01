import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../modalContent/modalContent.component';
import { ModalState } from '../../../@core/share/modal.state';
import {switchAll} from "rxjs/operators";

@Component({
    selector: 'modal-basic',
    templateUrl: './modalBasic.component.html',
    styleUrls: ['./modalBasic.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ModalBasicComponent {
    closeResult: string;
    private modalRef: any;

    constructor(private modalService: NgbModal,
                private elRef: ElementRef,
                private modalState: ModalState) {
    }

    public open(content, event, switchData) {
        this.modalState.setModalRefData(this.modalService.open(content), event, switchData);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    public close() {

    }
}
