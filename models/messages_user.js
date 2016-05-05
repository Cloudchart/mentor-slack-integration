'use strict';

module.exports = function(sequelize, DataTypes) {
  var MessagesUser = sequelize.define('MessagesUser', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    messageId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    rate: {
      type: DataTypes.INTEGER
    }

  }, {

    indexes: [{
      fields: ['messageId', 'userId'],
    }],

    classMethods: {
      associate: function(models) {
        MessagesUser.belongsTo(models.Message, { foreignKey: 'messageId' })
        MessagesUser.belongsTo(models.User, { foreignKey: 'userId' })
      }
    }

  });

  return MessagesUser;
};
