import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ModalService } from '../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
})
export class ModalComponent implements OnInit, OnDestroy {
  display = true;

  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Block body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Restore body scrolling when modal is closed
    document.body.style.overflow = '';
  }

  close(): void {
    this.display = false;
    setTimeout(() => this.modalService.close(), 300);
  }
}
