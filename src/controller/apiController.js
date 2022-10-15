import loginRegisterService from '../service/loginRegisterService';




const testApi = (req, res) => {
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    })
}

const handleRegister = async (req, res) => {
    try {
        //req.body :email,username,password,phone
        if (!req.body.email || !req.body.password || !req.body.phone) {
            return res.status(200).json({
                EM: 'Missing required parameters',
                EC: 1,
                DT: ''
            })
        }
        console.log('>>> lenght', req.body.password.lenght);
        if (req.body.password && req.body.password.length < 4) {
            return res.status(200).json({
                EM: 'Your password must have more than 3 letters',
                EC: 1,
                DT: ''
            })
        }
        // service :create user
        let data = await loginRegisterService.registerNewUser(req.body);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: ''
        })

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server',
            EC: -1,
            DT: ''
        })
    }
    // console.log('>>>> check req', req.body);
}
const handleLogin = async (req, res) => {

    // console.log('>>>> check data', req.body);
    try {

        let data = await loginRegisterService.handleUserLogin(req.body)
        // set cookie
        if (data && data.DT && data.DT.access_token) {
            res.cookie('jwt', data.DT.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
        }
        // console.log(data1);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'Error from server',
            EC: -1,
            DT: ''
        })
    }

}

const handleLogout = (req, res) => {
    try {
        res.clearCookie('jwt');
        return res.status(200).json({
            EM: 'ok clear ',
            EC: 0,
            DT: ''
        })

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server',
            EC: -1,
            DT: ''
        })
    }
}
module.exports = {
    testApi,
    handleRegister,
    handleLogin,
    handleLogout
}