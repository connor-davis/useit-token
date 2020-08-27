import PouchDB from "pouchdb";

export default class UsersDB {
    constructor() {
        this.db = new PouchDB("users");
    }

    async getUsers() {
        let allUsers = await this.db.allDocs({ include_docs: true });
        let users = {};

        allUsers.rows.forEach(u => users[u.id] = u.doc);

        return users;
    }

    async newUser(user) {
        user.createdAt = new Date();
        user.updateAt = new Date();
        user.balance = 0.0;

        const response = await this.db.post({ ...user });

        return response;
    }

    async updateUser(user) {
        const users = Object.values(await this.getUsers());

        const u = users.filter(u => u.idNumber === user.idNumber)[0];

        user._id = u._id;
        user._rev = u._rev;
        user.updateAt = new Date();

        const response = await this.db.put({ ...user });

        return response;
    }

    async deleteUser(user) {
        const response = await this.db.remove({ ...user });

        return response;
    }
}