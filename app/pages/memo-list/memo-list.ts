import {Component}                                  from '@angular/core';
import {Alert, AlertController}                     from 'ionic-angular';
import {NavController}                              from 'ionic-angular';

import {AlertForm} from '../../components';
import {Auth, AppStorage} from '../../providers';
import {MemoBusiness} from '../../providers';
import {Memo} from '../../models';
import {MemoDetailPage} from '../';

@Component({
  templateUrl: 'build/pages/memo-list/memo-list.html',
  providers: [Auth, AppStorage, MemoBusiness],
})
export class MemoListPage {

  private memos: Memo[] = [];

  constructor(
    private nav: NavController,
    private alertController: AlertController,
    private auth: Auth,
    private business: MemoBusiness
  ) {
    this.loadMemos();
  }

  /**
   * 
   * 
   * @protected
   */
  protected ngAfterViewInit(): void {
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
        return this.business.findByEmail(email);
      })
      .then(res => {
        this.memos = res;
      });
  }

  /**
   * 메모 상세보기 화면 이동을 위한 호출부분 
   * 
   * @protected
   * @param {Memo} [memo]
   */
  protected goToMemoDetail(memo?: Memo): void {
    let params: any = {};
    params.create = (memo) ? false : true;
    params.memo = memo;
    this.nav.push(MemoDetailPage, params);
  }
}
