import { Injectable } from '@angular/core';
import {
  Modal as NgxModal,
  TwoButtonPreset,
  TwoButtonPresetBuilder,
  bootstrap4Mode,
  OneButtonPresetBuilder,
  OneButtonPreset} from 'ngx-modialog/plugins/bootstrap';
import { DialogRef } from 'ngx-modialog';

@Injectable()
export class ConfirmService {

  private preset: TwoButtonPreset = <any>{
    size: '',
    isBlocking: true,
    showClose: true,
    keyboard: 27,
    dialogClass: '',
    headerClass: '',
    titleHtml: '',
    body: 'Do you want to proceed?',
    bodyClass: '',
    footerClass: 'modal-footer custom-modal-footer',
    okBtn: 'Yes',
    okBtnClass: '',
    cancelBtn: 'No',
    cancelBtnClass: 'btn btn-danger'
  };

  constructor(
    private ngxModal: NgxModal) {
    bootstrap4Mode();

  }

  open(...args: any[]): Promise<Boolean> {
    const fluent: TwoButtonPresetBuilder = <any>this.ngxModal['confirm']();
    let strContent = 'Do you want to proceed?';
    if (args.length > 0) {
      console.log(args[0]);
      strContent = args[0];
    }

    for (let key in this.preset) {
      const value = this.preset[key];
      if (value === null || value === '') continue;
      fluent[key](value);
    }
    const dialogRef: DialogRef<TwoButtonPreset> = fluent.showClose(true)
        .body(strContent)
        .open();


    return new Promise(
      (resolve, reject) => {
        dialogRef.result
        .then( (result) => {
            // console.log(`The result is: ${result}`);
            resolve(true);
          })
        .catch( () => {
          reject(false);
        });
      }
    );
  }

  alert(msg) {
    const fluent: OneButtonPresetBuilder = <any>this.ngxModal['alert']();

    // for (let key in this.preset) {
    //   let value = this.preset[key];
    //   if (value === null || value === '') continue;
    //   fluent[key](value);
    // }
    const dialogRef: DialogRef<OneButtonPreset> = fluent
      .isBlocking(false)
      .showClose(true)
      .body(msg)
      .open();
  }
}
