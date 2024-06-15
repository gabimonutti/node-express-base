const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

class BaseController {
    constructor(service) {
        this.service = service;
        this.methods.forEach(k => { this[k] = catchAsync(this[`_${k}`].bind(this)); });
    }

    get methods() {
        return ['list', 'create', 'get', 'remove', 'update'];
    }

    get idProperty() {
        const entityName = this.constructor.name.replace('Controller', '');
        return entityName[0].toLowerCase() + entityName.slice(1) + 'Id';
    }

    async _create(req, res) {
        const instance = await this.service.create(req.body, req.user);
        res.header('Location', `${req.baseUrl}${req.path}/${instance.id}`);
        res.status(httpStatus.CREATED).send();
    }

    async _remove(req, res) {
        await this.service.deleteById(req.params[this.idProperty]);
        res.status(httpStatus.NO_CONTENT).send();
    }

    async _list(req, res) {
        const results = await this.service.list(req.query);
        res.status(httpStatus.OK).send(results);
    }

    async _get(req, res) {
        const entity = await this.service.getById(req.params[this.idProperty]);
        res.send(entity);
    }

    async _update(req, res) {
        await this.service.updateById(req.params[this.idProperty], req.body, req.user);
        res.send();
    }
}

module.exports = BaseController;