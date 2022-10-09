'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User',
      [
        {
          email: 'John Doe1',
          password: '123',
          username: 'John1',
        },
        {
          email: 'John Doe2',
          password: '123',
          username: 'John2',
        },
        {
          email: 'John Doe3',
          password: '123',
          username: 'John3',
        },

      ]
      , {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
