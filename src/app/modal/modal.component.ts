import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService } from '../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
})
export class ModalComponent {
  display = true;

  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  constructor(private modalService: ModalService) {}

  close(): void {
    this.display = false;
    setTimeout(() => this.modalService.close(), 300);
  }
}
