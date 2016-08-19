'use strict';

import {ConvertUtil} from '../providers';

export interface IUserRest {
    _id: string;
    email: string;
    password: string;
    nick: string;
    name: string;
    role: string;
    location: string;
    pint: number;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
    facebook: {};
    twitter: {};
    google: {};
    github: {};
};

export interface IUserLocal {
    loginType: string;
    autoLogin: boolean;
    offlineMode: boolean;
};

export interface IUser extends IUserRest, IUserLocal { };

/**
 * 유저 정보
 * 
 * @export
 * @class User
 * @implements {IUser}
 */
export class User implements IUser {
    public static get LOGIN_TYPE_LOCAL(): string { return 'local'; }

    private __id: string;
    set _id(id: string) {
        this.__id = id;
    }
    get _id(): string {
        return this.__id;
    }

    private _email: string;
    set email(email: string) {
        this._email = email;
    }
    get email(): string {
        return this._email;
    }

    private _password: string;
    set password(password: string) {
        this._password = password;
    }
    get password(): string {
        return this._password;
    }

    private _nick: string;
    set nick(nick: string) {
        this._nick = nick;
    }
    get nick(): string {
        return this._nick;
    }

    private _name: string;
    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    private _role: string;
    set role(role: string) {
        this._role = role;
    }
    get role(): string {
        return this._role;
    }

    private _location: string;
    set location(location: string) {
        this._location = location;
    }
    get location(): string {
        return this._location;
    }

    private _pint: number;
    set pint(pint: number) {
        this._pint = pint;
    }
    get pint(): number {
        return this._pint;
    }

    private _provider: string;
    set provider(provider: string) {
        this._provider = provider;
    }
    get provider(): string {
        return this._provider;
    }

    private _createdAt: Date;
    set createdAt(createdAt: Date) {
        this._createdAt = createdAt;
    }
    get createdAt(): Date {
        return this._createdAt;
    }

    private _updatedAt: Date;
    set updatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt;
    }
    get updatedAt(): Date {
        return this._updatedAt;
    }

    private _facebook: any;
    set facebook(facebook: any) {
        this._facebook = facebook;
    }
    get facebook(): any {
        return this._facebook;
    }

    private _twitter: any;
    set twitter(twitter: any) {
        this._twitter = twitter;
    }
    get twitter(): any {
        return this._twitter;
    }

    private _google: any;
    set google(google: any) {
        this._google = google;
    }
    get google(): any {
        return this._google;
    }

    private _github: any;
    set github(github: any) {
        this._github = github;
    }
    get github(): any {
        return this._github;
    }

    private _loginType: string;
    set loginType(loginType: string) {
        this._loginType = loginType || User.LOGIN_TYPE_LOCAL;
    }
    get loginType(): string {
        return this._loginType;
    }

    private _autoLogin: boolean;
    set autoLogin(autoLogin: boolean) {
        if (autoLogin === null || autoLogin === undefined) {
            return;
        }
        this._autoLogin = autoLogin;
    }
    get autoLogin(): boolean {
        return this._autoLogin;
    }

    private _offlineMode: boolean;
    set offlineMode(offlineMode: boolean) {
        if (offlineMode === null || offlineMode === undefined) {
            return;
        }
        this._offlineMode = offlineMode;
    }
    get offlineMode(): boolean {
        return this._offlineMode;
    }

    /**
     * 초기화
     * 
     * @returns {User}
     */
    public reset(): User {
        this._id = undefined;
        this.email = this.name = this.location = this.pint = undefined;
        this.password = this.provider = undefined;
        this.nick = this.role = this.createdAt = this.updatedAt = undefined;
        this.facebook = this.twitter = this.google = this.github = undefined;
        this.loginType = '';
        this.autoLogin = false;
        this.offlineMode = false;
        return this;
    }

    /**
     * parse
     * 
     * @param {string} data
     * @returns {User}
     */
    public parse(data: string): User {
        this.reset();
        if (!data) {
            return this;
        }
        return this.copy(JSON.parse(data));
    }

    /**
     * copy
     * 
     * @param {IUser} item
     * @param {boolean} [deepCopy=false]
     * @returns {User}
     */
    public copy(item: IUser, deepCopy: boolean = false): User {
        if (!item) {
            return this.reset();
        }
        return this.copyRest(item, deepCopy).copyLocal(item, deepCopy);
    }

    /**
     * REST 정보 복사
     * 
     * @param {IUserRest} item
     * @param {boolean} [deepCopy=false]
     * @returns {User}
     */
    public copyRest(item: IUserRest, deepCopy: boolean = false): User {
        if (!item) {
            return this;
        }
        this._id = item._id;
        this.email = item.email;
        this.password = item.password;
        this.name = item.name;
        this.nick = item.nick;
        this.role = item.role;
        this.location = item.location;
        this.pint = item.pint;
        this.provider = item.provider;
        this.createdAt = ConvertUtil.toDate(item.createdAt, deepCopy);
        this.updatedAt = ConvertUtil.toDate(item.updatedAt, deepCopy);
        this.facebook = item.facebook;
        this.twitter = item.twitter;
        this.google = item.google;
        this.github = item.github;
        return this;
    }

    /**
     * 로컬 DB 정보 복사
     * 
     * @param {IUserLocal} item
     * @param {boolean} [deepCopy=false]
     * @returns {User}
     */
    public copyLocal(item: IUserLocal, deepCopy: boolean = false): User {
        if (!item) {
            return this;
        }
        this.loginType = item.loginType;
        this.autoLogin = item.autoLogin;
        this.offlineMode = item.offlineMode;
        return this;
    }

    /**
     * JSON 객체로 변환
     * 
     * @param {*} [target]
     * @returns {*}
     */
    public toJson(target?: any): any {
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
        target.email = this.email;
        target.password = this.password;
        target.nick = this.nick;
        target.name = this.name;
        target.role = this.role;
        target.location = this.location;
        target.pint = this.pint;
        target.provider = this.provider;
        target.createdAt = this.createdAt;
        target.updatedAt = this.updatedAt;
        target.facebook = this.facebook;
        target.twitter = this.twitter;
        target.google = this.google;
        target.github = this.github;
        return target;
    }

    /**
     * 로컬 DB JSON
     * 
     * @param {*} [target={}]
     * @returns {*}
     */
    public toLocalJson(target: any = {}): any {
        target.loginType = this.loginType;
        target.autoLogin = this.autoLogin;
        target.offlineMode = this.offlineMode;
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
     * @param {(string | IUser[])} data
     * @returns {User[]}
     */
    public static parseList(data: string | IUser[]): User[] {
        let list: User[] = [];
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
                list.push(new User().copy(json[i]));
            }
        } else {
            list.push(new User().copy(json));
        }
        return list;
    }

    /**
     * 파싱처리
     * 
     * @static
     * @param {(string | IUser)} src
     * @param {User} [desc]
     * @param {boolean} [deepCopy=false]
     * @returns {User}
     */
    public static parse(src: string | IUser, desc?: User, deepCopy: boolean = false): User {
        if (!src) {
            throw new Error(`invalid src`);
        }
        if (!desc) {
            desc = new User();
        }
        let json: IUser;
        if (typeof src === 'string') {
            json = JSON.parse(src);
        } else {
            json = src;
        }
        return desc.copy(json, deepCopy);
    }

    /**
     * JSON 객체로 변환
     * 
     * @static
     * @param {User[]} list
     * @returns {*}
     */
    public static toJson(list: User[]): any {
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
     * @param {User[]} list
     * @returns {string}
     */
    public static stringify(list: User[]): string {
        return JSON.stringify(User.toJson(list));
    }

    /**
     * 서로 다른 정보만 가져오기 
     * 
     * @param {IUser} target
     * @returns {User}
     */
    public static diff(original: IUser, target: IUser, result: IUser): boolean {
        let changed: boolean = false;
        if (original._id !== target._id) { result._id = target._id; changed = true; }
        if (original.email !== target.email) { result.email = target.email; changed = true; }
        if (original.password !== target.password) { result.password = target.password; changed = true; }
        if (original.nick !== target.nick) { result.nick = target.nick; changed = true; }
        if (original.name !== target.name) { result.name = target.name; changed = true; }
        if (original.role !== target.role) { result.role = target.role; changed = true; }
        if (original.location !== target.location) { result.location = target.location; changed = true; }
        if (original.pint !== target.pint) { result.pint = target.pint; changed = true; }
        if (original.provider !== target.provider) { result.provider = target.provider; changed = true; }
        if (original.createdAt !== target.createdAt) { result.createdAt = target.createdAt; changed = true; }
        if (original.updatedAt !== target.updatedAt) { result.updatedAt = target.updatedAt; changed = true; }
        if (original.facebook !== target.facebook) { result.facebook = target.facebook; changed = true; }
        if (original.twitter !== target.twitter) { result.twitter = target.twitter; changed = true; }
        if (original.google !== target.google) { result.google = target.google; changed = true; }
        if (original.github !== target.github) { result.github = target.github; changed = true; }
        if (original.loginType !== target.loginType) { result.loginType = target.loginType; changed = true; }
        if (original.autoLogin !== target.autoLogin) { result.autoLogin = target.autoLogin; changed = true; }
        if (original.offlineMode !== target.offlineMode) { result.offlineMode = target.offlineMode; changed = true; }
        return changed;
    }
}
