import e from 'express';
import userApiService from '../service/userApiService';



const readFunc = async (req, res) => {
    try {
        // console.log('<<<<', req.user);
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit
            // console.log('>>>> check page', page, ' checkk limit ', limit);
            let data = await userApiService.getUserWithPaginate(+page, +limit);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,

            })
        } else {
            let data = await userApiService.getAllUser();
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,

            })
        }

    } catch (e) {
        console.log('>>>> error readFunc', e);
        return res.status(500).json({
            EM: 'error from server!',
            EC: -1,
            DT: []
        })
    }
}
const createFunc = async (req, res) => {
    try {
        // validate
        let user = await userApiService.createNewUser(req.body);
        return res.status(200).json({
            EM: user.EM,
            EC: user.EC,
            DT: user.DT,

        })
    } catch (e) {
        console.log('>>>> error createFunc', e);
        return res.status(500).json({
            EM: 'error from server!',
            EC: -1,
            DT: ''
        })
    }
}
const updateFunc = async (req, res) => {
    try {
        console.log('>>>. res', req.body);
        let user = await userApiService.updateUser(req.body);
        return res.status(200).json({
            EM: user.EM,
            EC: user.EC,
            DT: user.DT,

        })

    } catch (e) {
        console.log('>>>> error updateFunc', e);
        return res.status(500).json({
            EM: 'error from server!',
            EC: -1,
            DT: ''
        })
    }
}
const deleteFunc = async (req, res) => {
    try {
        if (req.body.id) {
            let user = await userApiService.deleteUser(req.body.id);
            return res.status(200).json({
                EM: user.EM,
                EC: user.EC,
                DT: user.DT
            })
        } else {
            return res.status(500).json({
                EM: 'error from server!',
                EC: -1,
                DT: ''
            })
        }
    } catch (e) {
        console.log('>>>> error deleteFunc', e);
        return res.status(500).json({
            EM: 'error from server!',
            EC: -1,
            DT: ''
        })
    }
}

const getUserAccount = async (req, res) => {
    // console.log('>>>. check req ', req.user);
    return res.status(200).json({
        EM: 'OK',
        EC: 0,
        DT: {
            access_token: req.token,
            groupWithRoles: req.user.groupWithRoles,
            email: req.user.email,
            username: req.user.username
        }
    })
}
module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    getUserAccount

}