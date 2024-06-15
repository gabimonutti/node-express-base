const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { NotFoundServiceError } = require('./errors');

class ReadOnlyBaseService {
    constructor(dao, limit = 10, defaultSortBy = 'id') {
        this.dao = dao;
        this.limit = limit;
        this.defaultSortBy = defaultSortBy;
    }

    get entityName() {
        return this.constructor.name.replace('Service', '');
    }

    get idProperty() {
        return this.entityName[0].toLowerCase() + this.entityName.slice(1) + 'Id';
    }

    async getById(id, options = {}) {
        if (!id) {
            throw new Error('Invalid query');
        }
        const entity = await this.dao.findOne({ where: { id }, ...options });
        if (!entity) {
            throw new NotFoundServiceError(`${this.entityName} not found`);
        }
        return entity;
    }

    async list(filters = {}, options = {}) {
        const { offset, limit, order } = this._getPaginationAndOrder(options);
        const where = this.getWhere(filters);
        const results = await this.dao.findAndCountAll({
            where,
            order,
            offset,
            limit: options.paginate !== false ? limit : undefined,
            ...options,
        });
        return {
            results: results.rows,
            count: results.count,
        };
    }

    getWhere(filters) {
        return Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    }

    _getPaginationAndOrder(options) {
        const order = options.sortBy
            ? options.sortBy.split(',').map(sort => sort.startsWith('-') ? [sort.slice(1), 'DESC'] : [sort, 'ASC'])
            : this.defaultSortBy.split(',').map(sort => sort.startsWith('-') ? [sort.slice(1), 'DESC'] : [sort, 'ASC']);
        const limit = options.limit > 0 ? options.limit : this.limit;
        const page = options.page > 0 ? options.page : 1;
        const offset = (page - 1) * limit;

        return {
            offset,
            limit,
            order,
        };
    }
}

module.exports = ReadOnlyBaseService;