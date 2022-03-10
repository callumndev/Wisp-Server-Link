module.exports = class Auth {
    constructor() {
        this.apiRoute = "/auth/@me";
    }

    async get() {
        const data = await this._getRequest(this.apiRoute);
        if (!data || data.object != "user") return false;

        const user = data.attributes;
        if (!user) return false;
        
        const flags = [
            user.root_admin && "Root Admin"
        ].filter(Boolean);

        return {
            name: `${user.name_first} ${user.name_last}`,
            email: user.email,
            flags
        }
    }
}
