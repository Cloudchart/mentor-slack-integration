'use strict';

module.exports = function(sequelize, DataTypes) {
  var TeamNotification = sequelize.define('TeamNotification', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    teamId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    channelId: {
      type: DataTypes.STRING
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    responseBody: {
      type: DataTypes.TEXT
    }

  }, {

    classMethods: {
      associate: function(models) {
        TeamNotification.belongsTo(models.Team, { foreignKey: 'teamId' })
      }
    }

  });

  return TeamNotification;
};
