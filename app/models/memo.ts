'use strict';

import {ConvertUtil} from '../providers';

/**
 * 메모 목록에 대한 인터페이스 
 * 
 * @export
 * @interface IMemoRest
 */
export interface IMemoRest {
    _id: string;
    ownerId: string;
    title: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * 로컬 저장을 위한 인터페이스
 * 
 * @export
 * @interface IMemoLocal
 */
export interface IMemoLocal {
    /**
     * 인덱스 정보 
     * 
     * @type {number}
     */
    rowid: number;
    email: string;
};

/**
 * 메모 인터페이스
 * 
 * @export
 * @interface IMemo
 * @extends {IMemoRest}
 * @extends {IMemoLocal}
 */
export interface IMemo extends IMemoRest, IMemoLocal { };

/**
 * MEMO
 * 
 * @export
 * @class Memo
 * @implements {IMemo}
 */
export class Memo implements IMemo {

    private __id: string = undefined;
    set _id(id: string) {
        if (!id) {
            id = undefined;
        }
        this.__id = id;
    }
    get _id(): string {
        return this.__id;
    }

    private _ownerId: string = undefined;
    set ownerId(ownerId: string) {
        if (!ownerId) {
            ownerId = undefined;
        }
        this._ownerId = ownerId;
    }
    get ownerId(): string {
        return this._ownerId;
    }

    private _title: string = undefined;
    set title(title: string) {
        if (!title) {
            title = undefined;
        }
        this._title = title;
    }
    get title(): string {
        return this._title;
    }

    private _message: string = undefined;
    set message(message: string) {
        if (!message) {
            message = undefined;
        }
        this._message = message;
    }
    get message(): string {
        return this._message;
    }

    private _createdAt: Date = undefined;
    set createdAt(createdAt: Date) {
        if (!createdAt) {
            createdAt = undefined;
        }
        this._createdAt = createdAt;
    }
    get createdAt(): Date {
        return this._createdAt;
    }

    private _updatedAt: Date = undefined;
    set updatedAt(updatedAt: Date) {
        if (!updatedAt) {
            updatedAt = undefined;
        }
        this._updatedAt = updatedAt;
    }
    get updatedAt(): Date {
        return this._updatedAt;
    }

    private _rowid: number = -1;
    set rowid(rowid: number) {
        if (Number.isNaN(rowid)) {
            rowid = -1;
        }
        this._rowid = rowid;
    }
    get rowid(): number {
        return this._rowid;
    }

    private _email: string = undefined;
    set email(email: string) {
        if (!email) {
            email = undefined;
        }
        this._email = email;
    }
    get email(): string {
        return this._email;
    }

    public isValidRowid(): boolean {
        return Memo.isValidRowid(this);
    }

    /**
     * rowid 유효여부 반환
     * 
     * @static
     * @param {(IMemoLocal | number)} value
     * @returns {boolean}
     */
    public static isValidRowid(value: IMemoLocal | number): boolean {
        let check: number;
        if (typeof value === 'IMemoLocal') {
            check = value.rowid;
        } else {
            check = value;
        }
        return (Number.isNaN(check) === false || check >= 0);
    }

    /**
     * 초기화
     * 
     * @returns {Memo}
     */
    public reset(): Memo {
        this.resetRest();
        this.resetLocal();
        return this;
    }

    /**
     * 초기화
     * 
     * @returns {Memo}
     */
    public resetRest(): Memo {
        this._id = this.ownerId = undefined;
        this.title = this.message = undefined;
        this.createdAt = this.updatedAt = undefined;
        return this;
    }

    /**
     * 초기화
     * 
     * @returns {Memo}
     */
    public resetLocal(): Memo {
        this.rowid = -1;
        this.email = undefined;
        return this;
    }

    /**
     * parse
     * 
     * @param {string} data
     * @returns {Memo}
     */
    public parse(data: string): Memo {
        this.reset();
        if (!data) {
            return this;
        }
        return this.copy(JSON.parse(data));
    }

    /**
     * 
     * 
     * @param {IMemo} item
     * @param {boolean} [deepCopy=false]
     * @returns {Memo}
     */
    public copy(item: IMemo, deepCopy: boolean = false): Memo {
        if (!item) {
            return this.reset();
        }
        return this.copyRest(item, deepCopy).copyLocal(item, deepCopy);
    }

    /**
     * copy
     * 
     * @param {IMemoRest} item
     * @param {boolean} [deepCopy=false]
     * @returns {Memo}
     */
    public copyRest(item: IMemoRest, deepCopy: boolean = false): Memo {
        if (!item) {
            return this.resetRest();
        }
        this._id = item._id;
        this.ownerId = item.ownerId;
        this.title = item.title;
        this.message = item.message;
        this.createdAt = ConvertUtil.toDate(item.createdAt, deepCopy);
        this.updatedAt = ConvertUtil.toDate(item.updatedAt, deepCopy);
        return this;
    }

    /**
     * 
     * 
     * @param {IMemoLocal} item
     * @param {boolean} [deepCopy=false]
     * @returns {Memo}
     */
    public copyLocal(item: IMemoLocal, deepCopy: boolean = false): Memo {
        if (!item) {
            return this.resetLocal();
        }
        this.rowid = item.rowid;
        this.email = item.email;
        return this;
    }

    /**
     * JSON 객체로 변환
     * 
     * @param {*} [target={}]
     * @returns {*}
     */
    public toJson(target: any = {}): any {
        target = this.toRestJson(target);
        return this.toLocalJson(target);
    }

    /**
     * REST JSON
     * 
     * @param {*} [target={}]
     * @returns {*}
     */
    public toRestJson(target: any = {}): any {
        target._id = this._id;
        target.ownerId = this.ownerId;
        target.title = this.title;
        target.message = this.message;
        target.createdAt = this.createdAt;
        target.updatedAt = this.updatedAt;
        return target;
    }

    /**
     * 로컬 DB JSON
     * 
     * @param {*} [target={}]
     * @returns {*}
     */
    public toLocalJson(target: any = {}): any {
        target.rowid = this.rowid;
        target.email = this.email;
        return target;
    }

    /**
     * JSON stringify 반환 (내부 변수 _ 빠진다.) 
     * 
     * @returns {string}
     */
    public stringify(): string {
        return JSON.stringify(this.toJson());
    }

    /**
     * 배열 파싱처리
     * 
     * @static
     * @param {(string | IMemo[])} data
     * @returns {Memo[]}
     */
    public static parseList(data: string | IMemo[]): Memo[] {
        let list: Memo[] = [];
        let json: any;

        try {
            if (typeof data === 'string') {
                json = JSON.parse(data);
            } else {
                json = data;
            }
        } catch (error) {
            console.log(error);
            return list;
        }

        if (json.length >= 0) {
            for (let i: number = 0, length: number = json.length; i < length; i++) {
                list.push(new Memo().copy(json[i]));
            }
        } else {
            list.push(new Memo().copy(json));
        }
        return list;
    }

    /**
     * 
     * 
     * @static
     * @param {(string | IMemo)} src
     * @param {Memo} [desc]
     * @param {boolean} [deepCopy=false]
     * @returns {Memo}
     */
    public static parse(src: string | IMemo, desc?: Memo, deepCopy: boolean = false): Memo {
        if (!src) {
            throw new Error(`invalid src`);
        }
        if (!desc) {
            desc = new Memo();
        }
        let json: IMemo;
        if (typeof src === 'string') {
            json = JSON.parse(src);
        } else {
            json = src;
        }
        return desc.copy(json, deepCopy);
    }

    /**
     * 
     * 
     * @static
     * @param {Memo[]} list
     * @returns {*}
     */
    public static toJson(list: Memo[]): any {
        if (!list || list.length === 0) {
            return [];
        }
        let result: any[] = [];
        for (let i: number = 0, length: number = list.length; i < length; i++) {
            result.push(list[i].toJson());
        }
        return result;
    }

    /**
     * JSON stringify 반환 (내부 변수 _ 빠진다.) 
     * 
     * @static
     * @param {Memo[]} list
     * @returns {string}
     */
    public static stringify(list: Memo[]): string {
        return JSON.stringify(Memo.toJson(list));
    }

    /**
     * 객체의 차이점을 비교하고 target의 정보를 result에 반영
     * 
     * @static
     * @param {IMemo} original
     * @param {IMemo} target
     * @param {IMemo} result
     * @returns {boolean}
     */
    public static diff(original: IMemo, target: IMemo, result: IMemo): boolean {
        let changed: boolean = false;
        if (original._id !== target._id) { result._id = target._id; changed = true; }
        if (original.ownerId !== target.ownerId) { result.ownerId = target.ownerId; changed = true; }
        if (original.title !== target.title) { result.title = target.title; changed = true; }
        if (original.message !== target.message) { result.message = target.message; changed = true; }
        if (original.createdAt !== target.createdAt) { result.createdAt = target.createdAt; changed = true; }
        if (original.updatedAt !== target.updatedAt) { result.updatedAt = target.updatedAt; changed = true; }
        if (original.rowid !== target.rowid) { result.rowid = target.rowid; changed = true; }
        if (original.email !== target.email) { result.email = target.email; changed = true; }
        return changed;
    }
}
