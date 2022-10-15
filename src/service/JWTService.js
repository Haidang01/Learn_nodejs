import db from "../models/index"

const getGroupWithRole = async (user) => {
    let roles = await db.Group.findOne({
        where: { id: user.groupId },
        include: {
            model: db.Role,
            attributes: ['id', 'url', 'description'],
            through: { attributes: [] }
        }
    })
    // console.log('>>>> check role', roles.get({ plain: true }));
    return roles ? roles : {}
}




module.exports = {
    getGroupWithRole,
}