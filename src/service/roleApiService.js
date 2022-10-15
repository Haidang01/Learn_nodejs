import db from '../models/index';


const createNewRoles = async (roles) => {
    try {
        // const testArr = [
        //     { url: 'test1', description: 'abc' },
        //     { url: '/user/update', description: 'cde' }
        // ]

        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true
        })
        const persists = roles.filter(({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2))
        if (persists.length === 0) {
            return ({
                EM: 'Nothing to create ...!',
                EC: 0,
                DT: []
            })
        } else {
            await db.bulkCreate(persists)
            return ({
                EM: `Create roles success:${persists.length} roles ...`,
                EC: 0,
                DT: []
            })
        }
        // console.log('>>> results', results);
        // await db.Role.bulkCreate(roles);
    } catch (e) {
        console.log('>>>. error', e);
        return res.status(500).json({
            EM: 'error from server!',
            EC: -1,
            DT: ''
        })
    }

}
const getAllRoles = async () => {
    try {
        let data = await db.Role.findAll();
        return ({
            EM: '',
            EC: 0,
            DT: data
        })
    } catch (e) {
        console.log('>>>. error', e);
        return res.status(500).json({
            EM: 'error from server!',
            EC: -1,
            DT: ''
        })
    }
}
const deleteRole = async (id) => {
    try {
        let data = await db.Role.delete({
            where: { id: id }
        });
        return ({
            EM: 'Delete ok',
            EC: 0,
            DT: data
        })
    } catch (e) {
        console.log('>>>. error', e);
        return res.status(500).json({
            EM: 'error from server!',
            EC: -1,
            DT: ''
        })
    }
}
module.exports = {
    createNewRoles, getAllRoles, deleteRole
}