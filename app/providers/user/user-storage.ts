'use strict';

import {Injectable} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {IUser, User} from '../../models';

// let storage: SqlStorage = new SqlStorage();
let db: Storage = new Storage(SqlStorage, {
  name: 'user.db',
  location: 1,
  backupFlag: SqlStorage.BACKUP_LOCAL,
  existingDatabase: true,
});

@Injectable()
export class UserStorage {

  /**
   * Creates an instance of UserStorage.
   * 
   */
  constructor() {
    this.create()
      .then(res => { console.log(res); })
      .catch(err => { console.error(err); });
  }

  /**
   * 테이블 생성 쿼리
   * 
   * @returns {Promise<any>}
   */
  public create(): Promise<any> {
    const QUERY: string = `
      CREATE TABLE IF NOT EXISTS User (
          email           VARCHAR(100)    PRIMARY KEY 
        , password        VARCHAR(20)     NOT NULL
        , offlineMode     boolean         DEFAULT 0
        , nick            VARCHAR(128)
      )`;
    return db.query(QUERY);
  }

  /**
   * 메모 생성
   * 
   * @param {user} IUser
   * @returns {Promise<boolean>}
   */
  public insert(user: IUser): Promise<boolean> {
    if (!user) {
      Promise.reject(new Error(`invalid user.`));
      return;
    }
    const QUERY: string = `
      INSERT INTO User (email, password, offlineMode)
                VALUES (?, ?, ?)
    `;
    const VALUES: any[] = [user.email, user.password, user.offlineMode];
    return db.query(QUERY, VALUES)
      .then(res => {
        return Promise.resolve(res.res.rowsAffected === 1);
      })
      .catch(err => {
        console.log(err);
        return Promise.resolve(false);
      });
  }

  /**
   * EMAIL 검색
   * 
   * @param {string} email
   * @returns {Promise<User[]>}
   */
  public findByEmail(email: string): Promise<User[]> {
    if (!email) {
      Promise.reject(new Error(`invalid email.`));
      return;
    }
    const QUERY: string = `
      SELECT email, nick
        FROM User 
       WHERE email = ?
    `;
    const VALUES: any[] = [email];
    return db.query(QUERY, VALUES)
      .then(res => {
        return Promise.resolve(User.parseList(res.res.rows));
      })
      .catch(err => {
        console.log(err);
        return Promise.resolve([]);
      });
  }

  /**
   * 로그인
   * 
   * @param {*} [{email = '', password = ''}={}]
   * @returns {Promise<User>}
   */
  public login({email = '', password = ''}: any = {}): Promise<User> {
    if (!email || !password) {
      Promise.reject(new Error(`invalid email or password.`));
      return;
    }
    const QUERY: string = `
      SELECT email, nick
        FROM User 
       WHERE email = ? 
         AND password = ?
    `;
    const VALUES: any[] = [email, password];
    return db.query(QUERY, VALUES)
      .then(res => {
        if (res.res.rows.length > 0) {
          return Promise.resolve(User.parseList(res.res.rows)[0]);
        }
        return Promise.resolve(undefined);
      })
      .catch(err => {
        console.log(err);
        return Promise.resolve(undefined);
      });
  }
}
