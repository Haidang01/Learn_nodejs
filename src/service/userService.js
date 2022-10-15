
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);
const hashPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const createNewUser = async (email, password, username) => {
    let hashPass = hashPassword(password);
    try {
        await db.User.create({
            username: username,
            email: email,
            password: hashPass
        })
    } catch (error) {
        console.log('>>>check error:', error);
    }
}
const getUserList = async () => {
    // test relationships
    let newUser = await db.User.findOne({
        where: { id: 1 },
        attributes: ['id', 'username', 'email'],// chi dinh lay du lieu
        include: { model: db.Group, attributes: ['name', 'description',] },// lay them group
        raw: true,
        nest: true
    })

    let roles = await db.Role.findAll({
        attributes: ['url', 'description',],
        include: { model: db.Group, attributes: ['name', 'description'], where: { id: 1 } },// lay group de lay role
        raw: true,
        nest: true
    })

    // console.log('>>check new user', newUser);
    // console.log('>>check new role', roles);

    let users = [];
    users = await db.User.findAll();
    return users;
}
const DeleteUser = async (userId) => {
    await db.User.destroy({
        where: {
            id: userId
        }
    });


}
const getUserById = async (id) => {
    let user = {};
    user = await db.User.findOne({
        where: {
            id: id
        }
    })
    return user.get({ plain: true });// Sequelize, convert entity to plain object


}
const updateUserInfor = async (email, username, id) => {
    await db.User.update({ email: email, username: username }, {
        where: {
            id: id
        }
    })
}
module.exports = {
    createNewUser,
    getUserList,
    DeleteUser,
    getUserById,
    updateUserInfor
}