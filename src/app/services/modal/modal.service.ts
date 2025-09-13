import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  Type,
  createComponent,
} from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalRef?: ComponentRef<ModalComponent>;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector
  ) {}

  open<T>(component: Type<T>): void {
    if (this.modalRef) return; // schon offen

    // Modal erzeugen
    this.modalRef = createComponent(ModalComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.appRef.attachView(this.modalRef.hostView);

    document.body.appendChild(
      (this.modalRef.hostView as EmbeddedViewRef<any>).rootNodes[0]
    );

    // Content in Modal rein
    this.modalRef.instance.viewContainerRef.createComponent(component);
  }

  close(): void {
    if (!this.modalRef) return;
    this.appRef.detachView(this.modalRef.hostView);
    this.modalRef.destroy();
    this.modalRef = undefined;
  }
}
