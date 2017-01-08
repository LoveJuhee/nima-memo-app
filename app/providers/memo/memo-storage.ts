'use strict';

import {Injectable} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {IMemo, Memo} from '../../models';

// let storage: SqlStorage = new SqlStorage();
let db: Storage = new Storage(SqlStorage, {
  name: 'memo.db',
  location: 1,
  backupFlag: SqlStorage.BACKUP_LOCAL,
  existingDatabase: true,
});

@Injectable()
export class MemoStorage {

  /**
   * Creates an instance of MemoStorage.
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
      CREATE TABLE IF NOT EXISTS memo ( 
          email     VARCHAR(100)    NOT NULL
        , id        VARCHAR(24) 
        , ownerId   VARCHAR(24)
        , title     VARCHAR(256)    DEFAULT 'empty'
        , message   VARCHAR(5120)   DEFAULT 'empty'
        , createdAt datetime        DEFAULT CURRENT_TIMESTAMP
        , updatedAt datetime        DEFAULT CURRENT_TIMESTAMP
      )`;
    return db.query(QUERY);
  }

  /**
   * 메모 생성
   * 
   * @param {Memo} memo
   * @returns {Promise<any>}
   */
  public insert(memo: IMemo): Promise<any> {
    const QUERY: string = `
      INSERT INTO memo (email, title, message)
                VALUES (?, ?, ?)
      `;
    const VALUES: any[] = [memo.email, memo.title, memo.message];
    return db.query(QUERY, VALUES);
  }

  /**
   * rowid 기반 update
   * 
   * @param {IMemo} memo
   * @returns {Promise<any>}
   */
  public update(memo: IMemo): Promise<any> {
    if (!memo || !Memo.isValidRowid(memo)) {
      Promise.reject(new Error(`invalid memo.`));
      return;
    }
    const QUERY: string = `
      UPDATE memo
         SET title = ?, message = ?, updatedAt = date('now')
       WHERE rowid = ?
    `;
    const VALUES: any[] = [memo.title, memo.message, memo.rowid];
    return db.query(QUERY, VALUES);
  }

  /**
   * 이메일 기반 검색
   * 
   * @param {string} email
   * @returns {Promise<Memo[]>}
   */
  public findByEmail(email: string): Promise<Memo[]> {
    if (!email) {
      Promise.reject(new Error(`invalid email.`));
      return;
    }
    const QUERY: string = `
      SELECT *, rowid
        FROM memo 
       WHERE email = ?
    `;
    const VALUES: any[] = [email];
    return db.query(QUERY, VALUES)
      .then(res => {
        return Promise.resolve(Memo.parseList(res.res.rows));
      })
      .catch(err => {
        console.log(err);
        return Promise.resolve([]);
      });
  }

  /**
   * rowid 기반 검색
   * 
   * @param {number} rowid
   * @returns {Promise<Memo>}
   */
  public findByRowid(rowid: number): Promise<Memo> {
    if (!Memo.isValidRowid(rowid)) {
      Promise.reject(new Error(`invalid id(${rowid}).`));
      return;
    }
    const QUERY: string = `
      SELECT *, rowid
        FROM memo 
       WHERE rowid = ?
    `;
    const VALUES: any[] = [rowid];
    return db.query(QUERY, VALUES)
      .then(res => {
        return Promise.resolve(Memo.parse(res.res.rows[0]));
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }
}
