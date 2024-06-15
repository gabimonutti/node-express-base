/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        let [k1, k2] = Array.isArray(key) ? key : [key, key];
        if (object && Object.prototype.hasOwnProperty.call(object, k1)) {
            obj[k2] = object[k1];
        }
        return obj;
    }, {});
};

module.exports = pick;
