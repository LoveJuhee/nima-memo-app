'use strict';

import {Injectable} from '@angular/core';
import {MemoStorage} from '../../providers';
import {IMemo, Memo} from '../../models';

let _storage: MemoStorage;
let _map: any = {};

@Injectable()
export class MemoBusiness {

    constructor() {

    }

    protected get storage(): MemoStorage {
        if (!_storage) {
            _storage = new MemoStorage();
        }
        return _storage;
    }

    protected get map(): any {
        return _map;
    }

    /**
     * 이메일 기반 검색
     * 
     * @param {string} email
     * @returns {Promise<Memo[]>}
     */
    public findByEmail(email: string): Promise<Memo[]> {
        if (!email) {
            Promise.reject(new Error(`invalid email`));
            return;
        }
        if (this.map[email]) {
            return Promise.resolve(this.map[email]);
        }
        return this.storage.findByEmail(email)
            .then(res => {
                this.map[email] = res;
                return Promise.resolve(res);
            });
    }

    /**
     * MEMO 추가
     * 
     * @param {IMemo} memo
     * @returns {Promise<Memo>}
     */
    public insert(memo: IMemo): Promise<Memo> {
        if (!memo || !memo.email || (!memo.title && !memo.message)) {
            Promise.reject(new Error(`invalid memo`));
            console.log(memo);
            return;
        }

        let memos: Memo[];
        return this.findByEmail(memo.email)
            .then(res => {
                memos = res;
                return this.storage.insert(memo);
            })
            .then(res => {
                let rowid: number = res.res.insertId;
                return this.storage.findByRowid(rowid);
            })
            .then(res => {
                memos.push(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log(err);
                return Promise.reject(err);
            });
    }

    /**
     * rowid 기반 update
     * 
     * @param {IMemo} memo
     * @returns {Promise<Memo>}
     */
    public update(memo: IMemo): Promise<Memo> {
        if (!memo || !(memo.rowid >= 0) || !memo.email || (!memo.title && !memo.message)) {
            Promise.reject(new Error(`invalid memo`));
            console.log(memo);
            return;
        }

        let target: Memo;
        return this.findByEmail(memo.email)
            .then(res => {
                for (let i = 0, length = res.length; i < length; i++) {
                    if (res[i].rowid === memo.rowid) {
                        target = res[i];
                        break;
                    }
                }
                return this.storage.update(memo);
            })
            .then(res => {
                return this.storage.findByRowid(memo.rowid);
            })
            .then(res => {
                target.copy(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log(err);
                return Promise.reject(err);
            });
    }
}
