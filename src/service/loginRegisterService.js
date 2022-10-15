import db from '../models/index';
import { getGroupWithRole } from './JWTService';
import { createJWT } from '../middleware/JWTAction';
require('dotenv').config()
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
}





// register new user 

const checkEmailExist = async (email) => {
    let user = await db.User.findOne({ where: { email: email } });
    if (user) {
        return true;
    } else {
        return false;
    }
}
const checkPhoneExist = async (userPhone) => {
    let user = await db.User.findOne({ where: { phone: userPhone } });
    if (user) {
        return true;
    } else {
        return false;
    }
}
const registerNewUser = async (rawUserData) => {
    try {
        // check email /phone number are exist
        let isEmailExist = await checkEmailExist(rawUserData.email);
        // console.log('>>>check email', isEmailExist);
        if (isEmailExist === true) {
            return {
                EM: 'The email is already existed',
                EC: 1
            }
        }
        let isPhoneExist = await checkPhoneExist(rawUserData.phone);

        if (isPhoneExist) {
            return {
                EM: 'The phone number is already existed',
                EC: 1
            }
        }
        // hash user password (ma hoa password)
        let hashPassword = hashUserPassword(rawUserData.password);

        // create new user
        await db.User.create({
            email: rawUserData.email,
            username: rawUserData.username,
            password: hashPassword,
            phone: rawUserData.phone,
            groupId: 4,
        })
        return {
            EM: 'A user are creacted successfully',
            EC: 0
        }
    } catch (e) {
        console.log(e);
        return {
            EM: 'Somthing wrongs is service...',
            EC: -2
        }
    }
}
// login user
const handleUserLogin = async (datalogin) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: datalogin.valueLogin },
                    { phone: datalogin.valueLogin }
                ]
            }
        })
        // console.log('>>> check user sequelize', users);
        // console.log('>>> check js ', users.get({ plain: true }));
        if (user) {
            let isCorrectPassword = checkPassword(datalogin.password, user.password);
            if (isCorrectPassword) {

                // test role 
                let groupWithRoles = await getGroupWithRole(user);
                let payload = {
                    username: user.username,
                    email: user.email,
                    groupWithRoles,

                }

                // console.log('>>> payload', payload);
                let token = createJWT(payload)
                return {
                    EM: 'OK!',
                    EC: 0,
                    DT: {
                        access_token: token,
                        groupWithRoles: groupWithRoles,
                        email: user.email,
                        username: user.username
                    }
                }
            }
            return {
                EM: 'Your email/phone or password is incorrect!',
                EC: 1,
                DT: ''
            }
        } else {
            return {
                EM: 'Your email/phone or password is incorrect!',
                EC: 1,
                DT: ''
            }
        }
    } catch (e) {
        console.log(e);
        return {
            EM: 'Somthing wrongs is service...',
            EC: -2
        }
    }

}
module.exports = {
    registerNewUser,
    handleUserLogin,
    hashUserPassword,
    checkEmailExist,
    checkPhoneExist
}