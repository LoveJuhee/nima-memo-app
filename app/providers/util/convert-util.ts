'use strict';

export class ConvertUtil {
    /**
     * 날짜에 대한 처리를 위한 객체.
     * 
     * @static
     * @param {(string | Date)} src
     * @param {boolean} [deepCopy=false]
     * @returns {Date}
     */
    public static toDate(src: string | Date, deepCopy: boolean = false): Date {
        if (typeof src === 'string') {
            return new Date(src);
        } else {
            if (deepCopy) {
                return new Date(src.getTime());
            }
            return src;
        }
    }
}