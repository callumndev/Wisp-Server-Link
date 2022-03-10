module.exports = class RCON {
    constructor() {
        this.apiRoute = /^\/servers\/.+\/command$/g;
    }

    async post({ endpoint, postData }) {
        const { status } = await this._postRequest(endpoint, postData);
        return status == 204;
    }
}
