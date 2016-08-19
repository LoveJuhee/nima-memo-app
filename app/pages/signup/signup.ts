'use strict';

import {NavController, Page} from 'ionic-angular';
import {Alert, AlertController} from 'ionic-angular';
import {Response} from '@angular/http';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import { FormGroup, FormBuilder, Validators }      from '@angular/forms';

import {AlertForm} from '../../components';
import {UserStorage} from '../../providers';
import {User} from '../../models';

@Page({
  templateUrl: 'build/pages/signup/signup.html',
  providers: [UserStorage],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
})
export class SignupPage {
  private form: FormGroup;

  /**
   * Creates an instance of SignupPage.
   * 
   * @param {NavController} nav
   * @param {RestUserProvider} rest
   * @param {Auth} auth
   * @param {UserStorage} storage
   */
  constructor(
    private nav: NavController,
    private alertController: AlertController,
    private storage: UserStorage,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      offlineMode: [true, Validators.required],
    });
  }

  /**
   * 가입
   * 
   * @param {*} credentials
   * @returns {void}
   */
  public signup(account: any): void {
    if (!account) {
      console.log(`signup account is null or undefined.`);
      return;
    }
    let email: string = account.email;
    let password: string = account.password;
    let confirmPassword: string = account.confirmPassword;
    let offlineMode: boolean = account.offlineMode || false;

    if (!password || password !== confirmPassword) {
      AlertForm.ok(this.alertController, `오류`, `암호가 서로 다릅니다.`)
        .present();
      return;
    }

    if (offlineMode) {
      this.signupLocal({ email, password, offlineMode });
    }
  }

  /**
   * 내부 DB 가입
   * 
   * @private
   * @param {*} account
   */
  private signupLocal(account: any): void {
    if (!account) {
      console.log(`signupLocal account is null or undefined.`);
      return;
    }
    this.storage.findByEmail(account.email)
      .then(res => {
        if (res && res.length > 0) {
          AlertForm.ok(this.alertController, `가입실패`, `이미 사용중인 계정입니다.`)
            .present();
          return;
        }
        return this.storage.insert(account);
      })
      .then(res => {
        console.log(res);
      });
  }

  /**
   * 로그인 페이지로 이동
   */
  public login(): void {
    // this.nav.setRoot(LoginPage);
  }
}
