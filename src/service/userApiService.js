import db from "../models";
import { checkEmailExist, checkPhoneExist, hashUserPassword } from '../service/loginRegisterService';

const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ['id', 'username', 'email', 'phone', 'sex'],
            include: { model: db.Group, attributes: ['name', 'description'] },// them bang khac nuwax

        });
        if (users) {
            return {
                EM: 'Get data success',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'Something wrong with Service',
                EC: 1,
                DT: []
            }
        }

    } catch (e) {
        console.log('>>> error getAllUser', e);
        return res.status(200).json({
            EM: 'error from server!',
            EC: -1,
            DT: []
        })
    }
}
const createNewUser = async (data) => {
    try {
        // check email and phone number
        let isEmailExist = await checkEmailExist(data.email);
        // console.log('>>>check email', isEmailExist);
        if (isEmailExist === true) {
            return {
                EM: 'The email is already existed',
                EC: 1,
                DT: 'email'
            }
        }
        let isPhoneExist = await checkPhoneExist(data.phone);

        if (isPhoneExist) {
            return {
                EM: 'The phone number is already existed',
                EC: 1,
                DT: 'phone'

            }
        }
        // hash user password (ma hoa password)
        console.log(data.password);
        let hashPassword = hashUserPassword(data.password);
        console.log('<<<<< hash ', hashPassword);
        await db.User.create({ ...data, password: hashPassword })
        return {
            EM: 'Create ok',
            EC: 0,
            DT: []
        }
    } catch (e) {
        console.log('>>> error createNewUser ', e);
    }
}
const updateUser = async (data) => {
    try {
        console.log('>>> 1');
        if (!data.groupId) {
            return {
                EM: 'Error with empty GroupId',
                EC: 1,
                DT: 'group'
            }
        }
        let user = await db.User.findOne({
            where: { id: data.id }
        })
        if (user) {
            // let users = user.get({ plain: true })
            user.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId
            })
        }
        return {
            EM: 'Update ok',
            EC: 0,
            DT: []
        }
    } catch (e) {
        console.log('>>> error updateUser ', e);
        return {
            EM: 'Something wrong with Service',
            EC: 1,
            DT: []
        }
    }
}
const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id }
        })
        console.log('>>> chekc findong', user);
        if (user) {
            await user.destroy();

            return {
                EM: 'Delete user success',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'User not exits',
                EC: 2,
                DT: []
            }
        }

    } catch (e) {
        console.log('>>> error deleteUser ', e);
        return res.status(200).json({
            EM: 'error from server!',
            EC: -1,
            DT: []
        })
    }
}
const getUserWithPaginate = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;// lấy user đắt đầu từ offset
        // console.log('>> check ', offset, limit);
        // count :sum số bản ghi tìm thấy
        // row :Tổng số array kết quả trả về
        const { count, rows } = await db.User.findAndCountAll({
            order: [['id', 'DESC']],
            offset: offset,
            limit: limit,
            include: { model: db.Group, attributes: ['name', 'description', 'id'] },
            attributes: ['id', 'username', 'email', 'phone', 'sex', 'address']
        })
        // console.log('>> check count ', rows);

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, // tổng số phần tử =count
            totalPages: totalPage,// tống số page
            users: rows
        }
        // console.log('>>> check data', data);
        return {
            EM: 'lay ok',
            EC: 0,
            DT: data
        }
    } catch (e) {
        console.log('>>> error getUserWithPaginate ', e);
        return {
            EM: 'Something wrong with Service',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser,
    getUserWithPaginate
}


