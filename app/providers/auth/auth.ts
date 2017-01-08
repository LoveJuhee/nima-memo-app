import {Injectable}             from '@angular/core';
import {AppStorage}             from '../';
import {User, IUser}            from '../../models';

let currentUser: User;

@Injectable()
export class Auth {
  public static get USER_KEY(): string { return 'CURRENT_USER'; }

  constructor(
    private storage: AppStorage
  ) {
    console.log(`create AppStorage`);
  }

  /**
   * 유저 정보 반환 (만약 없을 경우 DB에서 추출)
   * 
   * @returns {Promise<User>}
   */
  public getCurrentUser(): Promise<User> {
    if (!currentUser) {
      return this.storage.get(Auth.USER_KEY)
        .then(res => {
          if (!res) {
            return Promise.resolve(undefined);
          }
          this.setUser(res);
          return Promise.resolve(currentUser);
        });
    } else {
      return Promise.resolve(currentUser);
    }
  }

  /**
   * 
   * 
   * @private
   * @param {(string | IUser)} [data]
   * @returns {void}
   */
  private setUser(data?: string | IUser): void {
    if (!data) {
      // 정보가 없으면 제거
      currentUser = undefined;
      return;
    }

    if (!currentUser) {
      currentUser = new User();
    }
    if (typeof data === 'string') {
      currentUser.parse(data);
    } else {
      currentUser.copy(data);
    }
  }

  /**
   * 유저 정보 저장
   * 
   * @param {User} [user] 없으면 제거
   * @returns {Promise<any>}
   */
  public setCurrentUser(user?: IUser): Promise<any> {
    this.setUser(user);
    return this.storage.set(Auth.USER_KEY, (currentUser) ? currentUser.stringify() : undefined);
  }

  /**
   * 로그아웃 - 현재 유저 정보 제거
   * 
   * @returns {Promise<{}>}
   */
  public logout(): Promise<boolean> {
    return this.setCurrentUser()
      .then(() => Promise.resolve(true));
  }
}
