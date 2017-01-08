import {Component}                                  from '@angular/core';
import {Alert, AlertController}                     from 'ionic-angular';
import {NavController}                              from 'ionic-angular';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES}  from '@angular/forms';
import {FormGroup, FormBuilder, Validators}         from '@angular/forms';

import {AlertForm} from '../../components';
import {SignupPage, MemoListPage} from '../../pages';
import {Auth, AppStorage} from '../../providers';
import {UserStorage} from '../../providers';
import {User} from '../../models';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [Auth, AppStorage, UserStorage],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
})
export class LoginPage {
  private form: FormGroup;

  constructor(
    private nav: NavController,
    private alertController: AlertController,
    private auth: Auth,
    private storage: UserStorage,
    fb: FormBuilder
  ) {
    // 계정정보 가져오기
    this.checkAuthLogin();

    this.initForm(fb);
  }

  /**
   * 로그인에 사용할 폼그룹 생성
   * 
   * @private
   * @param {FormBuilder} fb
   */
  private initForm(fb: FormBuilder): void {
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      autoLogin: [false, Validators.required],
      offlineMode: [true, Validators.required],
    });
  }

  /**
   * 저장소에서 로그인정보 가져오기
   * 
   * @private
   */
  private checkAuthLogin(): void {
    this.auth.getCurrentUser()
      .then(res => {
        console.log(`checkAuthLogin`);
        console.log(res);
        if (!res) {
          return;
        }
        this.goToMain();
      })
      .catch(console.log);
  }

  /**
   * 로그인 시도
   */
  public login(account: any): void {
    if (!account) {
      console.log(`signup account is null or undefined.`);
      return;
    }
    let email: string = account.email;
    let password: string = account.password;
    let offlineMode: boolean = account.offlineMode || false;

    if (!email || !password) {
      AlertForm.ok(this.alertController, `오류`, `이메일 또는 암호가 없습니다.`)
        .present();
      return;
    }

    if (offlineMode) {
      this.loginLocal(account);
    }
  }

  /**
   * 로컬 DB 로그인 시도
   * 
   * @param {*} account
   */
  public loginLocal(account: any): void {
    this.storage.login(account)
      .then(res => {
        if (!res) {
          AlertForm.ok(this.alertController, `오류`, `로그인을 실패하였습니다.`)
            .present();
          return;
        }
        this.auth.setCurrentUser(res)
          .then(() => {
            this.goToMain();
          });
      });
  }

  /**
   * 가입 페이지로 이동
   */
  public signup(): void {
    this.nav.setRoot(SignupPage);
  }

  public goToMain(): void {
    this.nav.setRoot(MemoListPage);
  }

}
