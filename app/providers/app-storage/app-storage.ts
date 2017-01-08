'use strict';

import {Injectable} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

// let storage: SqlStorage = new SqlStorage();
let db: Storage = new Storage(SqlStorage, {
  name: 'nima.db',
  location: 1,
  backupFlag: SqlStorage.BACKUP_LOCAL,
  existingDatabase: true,
});

@Injectable()
export class AppStorage {
  /**
   * 쿼리 함수
   * 
   * @protected
   */
  protected query: (query: string, params?: any) => Promise<any> = db.query;

  /**
   * 정보 반환
   * 
   * @param {string} key
   * @returns {Promise<any>}
   */
  public get(key: string): Promise<any> {
    if (!key) {
      return Promise.reject(new Error(`invalid key`));
    }
    return db.get(key)
      .then(res => {
        console.log(`get(${key})`);
        console.log(res);
        if (res === 'undefined') res = undefined;
        return Promise.resolve(res);
      });
  }

  /**
   * 정보 저장
   * 
   * @param {string} key
   * @param {*} value
   * @returns {Promise<any>}
   */
  public set(key: string, value: any): Promise<any> {
    if (!key) {
      return Promise.reject(new Error(`invalid key`));
    }
    if (!value || value === 'undefined') {
      return this.remove(key);
    }
    return db.set(key, value)
      .then(res => {
        console.log(`set(${key}, ${value})`);
        console.log(res);
        return Promise.resolve(res);
      });
  }

  /**
   * 정보 삭제
   * 
   * @param {string} key
   * @returns {Promise<any>}
   */
  public remove(key: string): Promise<any> {
    if (!key) {
      return Promise.reject(new Error(`invalid key`));
    }
    return db.remove(key)
      .then(res => {
        console.log(`remove(${key})`);
        console.log(res);
        return Promise.resolve(res);
      });
  }
}
