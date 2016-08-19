'use strict';

import {AlertController, Alert} from 'ionic-angular';

export class AlertForm {
  /**
   * OK, CANCEL AlertController
   * 
   * @static
   * @param {AlertController} alertController
   * @param {string} title
   * @param {string} message
   * @param {(params: any) => void} [ok] OK 버튼 클릭시 동작할 함수
   * @param {*} [okParam] OK 함수에 전달할 파라메터
   * @param {(params: any) => void} [cancel] 취소 버튼 클릭시 동작할 함수
   * @param {*} [cancelParam] 취소 함수에 전달할 파라메터
   * @returns {Alert}
   */
  public static okCancel(alertController: AlertController,
    title: string, message: string,
    ok?: (params: any) => void, okParam?: any,
    cancel?: (params: any) => void, cancelParam?: any
  ): Alert {
    let alert: Alert = alertController.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          handler: () => { if (cancel) cancel(okParam); },
        }, {
          text: 'Ok',
          handler: () => { if (ok) ok(cancelParam); },
        },
      ],
    });
    return alert;
  }

  /**
   * OK AlertController
   * 
   * @static
   * @param {AlertController} alertController
   * @param {string} title
   * @param {string} message
   * @param {(params: any) => void} [ok] OK 버튼 클릭시 동작할 함수
   * @param {*} [okParam] OK 함수에 전달할 파라메터
   * @returns {Alert}
   */
  public static ok(alertController: AlertController,
    title: string, message: string,
    ok?: (params: any) => void, okParam?: any
  ): Alert {
    let alert: Alert = alertController.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => { if (ok) ok(okParam); },
        },
      ],
    });
    return alert;
  }
}