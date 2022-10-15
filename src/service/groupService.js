
import db from '../models/index'

const getGroup = async () => {
    try {
        let data = await db.Group.findAll({
            order: [['name', 'ASC']] // theo bảng chữ cái
        })
        return {
            EM: 'Get group success',
            EC: 0,
            DT: data
        }

    } catch (e) {
        console.log('>>> error getGroup', e);
        return {
            EM: 'error from server!',
            EC: -1,
            DT: []

        }
    }
}

module.exports = {
    getGroup,

}