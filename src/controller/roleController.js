
import roleApiService from '../service/roleApiService';



const readFunc = async (req, res) => {

    try {
        let data = await roleApiService.getAllRoles();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,

        })


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
        console.log('me');
        let user = await roleApiService.createNewRoles(req.body);
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
            let user = await roleApiService.deleteRole(req.body.id);
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

module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,

}