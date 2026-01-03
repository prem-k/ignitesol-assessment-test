import {
  Directive,
  Input,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLoadMore]',
})
export class LoadMoreDirective implements OnDestroy {

  @Input() callBackFn!: () => void;
  @Input() offset = 150;

  private scrollHandler!: () => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollHandler = this.onScroll.bind(this);
      window.addEventListener('scroll', this.scrollHandler);
    }
  }

  private onScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= pageHeight - this.offset) {
      this.callBackFn?.();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
