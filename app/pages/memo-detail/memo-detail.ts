import {Component}                                  from '@angular/core';
import {Alert, AlertController}                     from 'ionic-angular';
import {NavController, NavParams}                   from 'ionic-angular';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES}  from '@angular/forms';
import {FormGroup, FormControl, FormBuilder, Validators}         from '@angular/forms';

import {AlertForm} from '../../components';
import {Auth, AppStorage} from '../../providers';
import {MemoBusiness} from '../../providers';
import {Memo, IMemo} from '../../models';

enum MemoDetailState { CREATE, VIEW, CHANGED };

@Component({
  templateUrl: 'build/pages/memo-detail/memo-detail.html',
  providers: [MemoBusiness],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
})
export class MemoDetailPage {
  private form: FormGroup;
  private formTitle: FormControl;
  private formMessage: FormControl;

  /**
   * 상태정보 
   * 
   * @private
   * @type {MemoDetailState}
   */
  private _state: MemoDetailState;
  set state(state: MemoDetailState) {
    this._state = state;
  }
  get state(): MemoDetailState {
    return this._state;
  }

  /**
   * 원본 데이터 
   * 
   * @private
   * @type {Memo}
   */
  private _origin: Memo = new Memo();
  get origin(): Memo {
    return this._origin;
  }
  set origin(origin: Memo) {
    this._origin = origin;
  }

  /**
   * 표시 데이터 
   * 
   * @private
   * @type {Memo}
   */
  private _memo: Memo = new Memo();
  get memo(): Memo {
    return this._memo;
  }
  set memo(memo: Memo) {
    this._memo = memo;
  }

  /**
   * 수정모드 여부 
   * 
   * @private
   * @type {boolean}
   */
  private _editMode: boolean = false;
  get editMode(): boolean {
    return this._editMode;
  }
  set editMode(editMode: boolean) {
    this._editMode = editMode;
  }

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private alertController: AlertController,
    private auth: Auth,
    private business: MemoBusiness,
    private fb: FormBuilder
  ) {
    let memo: Memo = this.navParams.data.memo;
    let create: boolean = this.navParams.data.create;
    if (memo) {
      this.origin.copy(memo);
      this.memo.copy(memo);
      this.state = MemoDetailState.VIEW;
    } else {
      this.editMode = true;
      this.state = MemoDetailState.CREATE;
    }

    this.formTitle = new FormControl(this.memo.title);
    this.formMessage = new FormControl(this.memo.message);
    this.form = this.fb.group({
      title: this.formTitle,
      message: this.formMessage,
    });

    if (create)
      this.auth.getCurrentUser()
        .then(user => {
          if (!user) {
            console.log(`current user is invalid`);
            console.log(user);
            return;
          }
          this.memo.email = user.email;
          this.origin.email = user.email;
        });
  }

  /**
   * 
   * 
   * @protected
   */
  protected ngAfterViewInit(): void {
  }

  /**
   * 저장
   * 
   * @protected
   * @returns {void}
   */
  protected save(): void {
    this.memo.title = this.form.value.title;
    this.memo.message = this.form.value.message;
    let changed: boolean = Memo.diff(this.origin, this.memo);
    if (!changed) {
      this.editMode = false;
      return;
    }

    let promiseResult: Promise<Memo> = (this.origin.rowid >= 0) ? this.business.update(this.memo) : this.business.insert(this.memo);
    promiseResult
      .then(res => {
        this.origin.copy(res);
        this.memo.copy(res);
        this.editMode = false;
        this.state = MemoDetailState.VIEW;
      })
      .catch(err => {
        AlertForm.ok(this.alertController, `오류`, `저장에 실패하였습니다.\n${err.message}`)
          .present();
        console.log(err);
      });
  }

  protected cancel(): void {
    let target: MemoDetailPage = this;
    function okFun(): () => void {
      let t: MemoDetailPage = target;
      return function (): void {
        if (t.state === MemoDetailState.CREATE) {
          t.nav.pop();
        }
        t.memo.copy(t.origin);
        t.formTitle.updateValue(t.memo.title);
        t.formMessage.updateValue(t.memo.message);
        t.editMode = false;
      };
    }

    this.memo.title = this.form.value.title;
    this.memo.message = this.form.value.message;
    let changed: boolean = Memo.diff(this.origin, this.memo);
    if (changed) {
      let fun: () => void = okFun();
      AlertForm.okCancel(this.alertController, `주의`, `수정된 내용이 있습니다. 취소하시겠습니까?`, fun)
        .present();
    } else {
      if (this.state === MemoDetailState.CREATE) {
        this.nav.pop();
      } else {
        this.editMode = false;
      }
    }
  }
}

