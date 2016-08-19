import {Component}                                  from '@angular/core';
import {Alert, AlertController}                     from 'ionic-angular';
import {NavController}                              from 'ionic-angular';

import {AlertForm} from '../../components';
import {Auth, AppStorage} from '../../providers';
import {MemoStorage} from '../../providers';
import {Memo} from '../../models';

@Component({
  templateUrl: 'build/pages/memo-list/memo-list.html',
  providers: [Auth, AppStorage, MemoStorage],
})
export class MemoListPage {

  private memos: Memo[] = [];

  constructor(
    private nav: NavController,
    private alertController: AlertController,
    private auth: Auth,
    private storage: MemoStorage
  ) {
  }

  /**
   * 
   * 
   * @protected
   */
  protected ngAfterViewInit(): void {
    this.loadMemos();
  }

  /**
   * 메모 목록 가져오기 
   * 
   * @protected
   */
  protected loadMemos(): void {
    this.auth.getCurrentUser()
      .then(res => {
        if (!res) {
          AlertForm.ok(this.alertController, '오류', '유저 정보를 가져올 수 없습니다.')
            .present();
          Promise.resolve([]);
          return;
        }
        let email: string = res.email;
        return this.storage.findByEmail(email);
      })
      .then(res => {
        this.memos = res;
      });
  }

}
