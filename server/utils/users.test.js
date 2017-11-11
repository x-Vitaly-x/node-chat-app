var expect = require('expect');

var {Users} = require("./users");


describe('Users', () => {
    var users, u1, u2, u3;

    beforeEach(() => {
        users = new Users();
        u1 = {
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        };
        u2 = {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        };
        u3 = {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        };
        users.users = [u1, u2, u3];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Vitaly',
            room: 'Test'
        }
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
        expect(resUser).toEqual(user);
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    });

    it('should remove a user', () => {
        var user = users.removeUser('1');
        expect(user).toEqual(u1);
        expect(users.users).toEqual([u2, u3]);
    });

    it('should not remove a user', () => {
        var user = users.removeUser('4');
        expect(user).toNotExist();
        expect(users.users).toEqual([u1, u2, u3]);
    });

    it('should find user', () => {
        var user = users.getUser('1');
        expect(user).toEqual(u1);
    });

    it('should not find user', () => {
        var user = users.getUser('4');
        expect(user).toNotExist();
    });
});

