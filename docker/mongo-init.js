db = db.getSiblingDB('mern_db');

db.createUser({
    user: 'root',
    pwd: 'example',
    roles: [{ role: 'readWrite', db: 'mern_db' }],
});

db.createCollection('users');
