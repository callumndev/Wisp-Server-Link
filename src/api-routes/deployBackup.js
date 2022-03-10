module.exports = class DeployBackup {
    constructor() {
        this.apiRoute = /^\/servers\/.+\/backups\/.+\/deploy$/g;
    }

    async post({ endpoint }) {
        const { status } = await this._postRequest(endpoint);
        return status == 204;
    }
}
