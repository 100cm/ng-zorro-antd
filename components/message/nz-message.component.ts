import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { isPromise } from '../core/util';
import { NzMessageContainerComponent } from './nz-message-container.component';
import { NzMessageDataFilled, NzMessageDataOptions } from './nz-message.definitions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'nz-message',
  preserveWhitespaces: false,
  animations: [
    trigger('enterLeave', [
      state('enter', style({opacity: 1, transform: 'translateY(0)'})),
      transition('* => enter', [
        style({opacity: 0, transform: 'translateY(-50%)'}),
        animate('100ms linear')
      ]),
      state('leave', style({opacity: 0, transform: 'translateY(-50%)'})),
      transition('* => leave', [
        style({opacity: 1, transform: 'translateY(0)'}),
        animate('100ms linear')
      ])
    ])
  ],
  templateUrl: './nz-message.component.html'
})
export class NzMessageComponent implements OnInit, OnDestroy {

  @Input() nzMessage: NzMessageDataFilled;
  @Input() nzIndex: number;

  protected _options: NzMessageDataOptions; // Shortcut reference to nzMessage.options

  // For auto erasing(destroy) self
  private _autoErase: boolean; // Whether record timeout to auto destroy self
  private _eraseTimer: number = null;
  private _eraseTimingStart: number;
  private _eraseTTL: number; // Time to live

  constructor(
    private _messageContainer: NzMessageContainerComponent,
    protected cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this._options = this.nzMessage.options;

    if (this._options.nzAnimate) {
      this.nzMessage.state = 'enter';
    }

    this._autoErase = this._options.nzDuration > 0;

    if (this._autoErase) {
      this._initErase();
      this._startEraseTimeout();
    }
  }

  ngOnDestroy(): void {
    if (this._autoErase) {
      this._clearEraseTimeout();
    }
  }

  onEnter(): void {
    if (this._autoErase && this._options.nzPauseOnHover) {
      this._clearEraseTimeout();
      this._updateTTL();
    }
  }

  onLeave(): void {
    if (this._autoErase && this._options.nzPauseOnHover) {
      this._startEraseTimeout();
    }
  }

  // Remove self
  protected removeInside(): Promise<void> {
    if (this._options.nzAnimate) {
      this.nzMessage.state = 'leave';
      this.cdr.detectChanges();
      setTimeout(() => this._messageContainer.removeMessage(this.nzMessage.messageId), 200);
    } else {
      this._messageContainer.removeMessage(this.nzMessage.messageId);
    }
    return Promise.resolve();
  }

  protected _destroy(): void {
    if (this.nzMessage.options && typeof this.nzMessage.options.nzOnClose === 'function') {
      const result = this.nzMessage.options.nzOnClose(this.nzMessage);
      const caseClose = (doClose: boolean | void | {}) => {
        if (doClose !== false) {
          this.removeInside();
        }
      }; // Users can return "false" to prevent closing by default
      if (isPromise(result)) {
        const handleThen = (doClose) => {
          caseClose(doClose);
        };
        (result as Promise<void>).then(handleThen).catch(handleThen);
      } else {
        caseClose(result);
      }
    } else {
      this.removeInside();
    }
  }

  private _initErase(): void {
    this._eraseTTL = this._options.nzDuration;
    this._eraseTimingStart = Date.now();
  }

  private _updateTTL(): void {
    if (this._autoErase) {
      this._eraseTTL -= Date.now() - this._eraseTimingStart;
    }
  }

  private _startEraseTimeout(): void {
    if (this._eraseTTL > 0) {
      this._clearEraseTimeout(); // To prevent calling _startEraseTimeout() more times to create more timer
      // TODO: `window` should be removed in milestone II
      this._eraseTimer = window.setTimeout(() => this._destroy(), this._eraseTTL);
      this._eraseTimingStart = Date.now();
    } else {
      this._destroy();
    }
  }

  private _clearEraseTimeout(): void {
    if (this._eraseTimer !== null) {
      window.clearTimeout(this._eraseTimer);
      this._eraseTimer = null;
    }
  }
}
