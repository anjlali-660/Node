const { Sequelize } = require('sequelize')
const sequelize= require('../util/database')


const seats = sequelize.define('seats', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    coach_no: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    row_no: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    seats_booked: {
        type: Sequelize.JSON
    },

    seats_available: {
        type: Sequelize.JSON
    },


    created_at: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn('now')
    },
    updated_at: { type: Sequelize.DATE }
}, {
    tableName: 'seats',
    timestamps: false
})

module.exports=seats
