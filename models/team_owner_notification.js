'use strict';

module.exports = function(sequelize, DataTypes) {
  var TeamOwnerNotification = sequelize.define('TeamOwnerNotification', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    teamOwnerId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    channelId: {
      type: DataTypes.STRING
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {

    indexes: [{
      fields: ['teamOwnerId', 'channelId'],
    }],

    classMethods: {
      associate: function(models) {
        TeamOwnerNotification.belongsTo(models.TeamOwner, { foreignKey: 'teamOwnerId' })
      }
    }

  });

  return TeamOwnerNotification;
};
