module.exports = class Backups {
    constructor() {
        this.apiRoute = /^\/servers\/.+\/backups$/g;
    }

    async get({ endpoint }) {
        const { data } = await this._getRequest(endpoint);
        return data;
    }

    async post({ endpoint, postData }) {
        const { status } = await this._postRequest(endpoint, postData);
        return status == 200;
    }
}
