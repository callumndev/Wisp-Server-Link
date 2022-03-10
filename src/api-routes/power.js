module.exports = class Power {
    constructor() {
        this.apiRoute = /^\/servers\/.+\/power$/g;
    }

    async post({ endpoint, postData }) {
        const { status } = await this._postRequest(endpoint, postData);
        return status == 204;
    }
}
