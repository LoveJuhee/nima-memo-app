import {Injectable}             from '@angular/core';
import {AppStorage}             from '../';
import {User}                   from '../../models';

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
          currentUser.parse(res);
          return Promise.resolve(currentUser);
        });
    } else {
      return Promise.resolve(currentUser);
    }
  }

  /**
   * 유저 정보 저장
   * 
   * @param {User} [user] 없으면 제거
   * @returns {Promise<any>}
   */
  public setCurrentUser(user?: User): Promise<any> {
    if (!user) {
      currentUser = undefined;
    } else {
      if (!currentUser) {
        currentUser = new User();
      }
      currentUser.copy(user);
    }
    return this.storage.set(Auth.USER_KEY, (user) ? user.stringify() : undefined);
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
