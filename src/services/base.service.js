const ReadOnlyBaseService = require('./readOnlyBase.service');
const { ServiceError, NotFoundServiceError } = require('./errors');
const sequelize = require('../config/db');

class BaseService extends ReadOnlyBaseService {
    /**
     * Create an entity
     * @param {Object} entityBody
     * @param {Object} createdBy
     * @param {Object} options
     * @returns {Promise<Entity>}
     */
    async create(entityBody, createdBy, options = {}) {
        const { transaction } = options;
        if (!transaction) {
            return await sequelize.transaction(async (transaction) => {
                return this.create(entityBody, createdBy, { ...options, transaction });
            });
        }

        try {
            return await this.dao.create(
                { ...entityBody, createdBy: createdBy?.id, updatedBy: createdBy?.id },
                { transaction }
            );
        } catch (err) {
            throw new ServiceError(err.message);
        }
    }

    /**
     * Delete an entity by id
     * @param {string} entityId
     * @param {Object} deletedBy
     * @param {Object} options
     * @returns {Promise<void>}
     * @throws {NotFoundServiceError} entity not found
     */
    async deleteById(entityId, deletedBy, options = {}) {
        const { transaction } = options;
        if (!transaction) {
            return await sequelize.transaction(async (transaction) => {
                return this.deleteById(entityId, deletedBy, { transaction });
            });
        }

        const entity = await this.getById(entityId, { transaction });
        if (!entity) {
            throw new NotFoundServiceError(this.notFoundMessage);
        }
        
        try {
            await entity.destroy({ transaction });
        } catch (err) {
            throw new ServiceError(err.message);
        }
    }

    /**
     * Update an entity by id
     * @param {string} entityId
     * @param {Object} toUpdate
     * @param {Object} updatedBy
     * @param {Object} options
     * @returns {Promise<Entity>}
     * @throws {NotFoundServiceError} entity not found
     */
    async updateById(entityId, toUpdate, updatedBy, options = {}) {
        const { transaction } = options;
        if (!transaction) {
            return await sequelize.transaction(async (transaction) => {
                return this.updateById(entityId, toUpdate, updatedBy, { ...options, transaction });
            });
        }

        const entity = await this.getById(entityId, { transaction });
        if (!entity) {
            throw new NotFoundServiceError(this.notFoundMessage);
        }

        try {
            return await entity.update(
                { ...toUpdate, updatedBy: updatedBy?.id },
                { transaction }
            );
        } catch (err) {
            throw new ServiceError(err.message);
        }
    }
}

module.exports = BaseService;