'use strict';

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('Team', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING
    },

    accessToken: {
      type: DataTypes.STRING,
      allowNull: false
    },

    ownerId: {
      type: DataTypes.STRING
    },

    responseBody: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {

    classMethods: {
      associate: function(models) {
        Team.hasMany(models.Channel, { foreignKey: 'teamId', onDelete: 'CASCADE' })
        Team.hasMany(models.User, { foreignKey: 'teamId', onDelete: 'CASCADE' })
        Team.hasMany(models.TeamNotification, { foreignKey: 'teamId', onDelete: 'CASCADE' })
        Team.hasOne(models.TimeSetting, { foreignKey: 'teamId', onDelete: 'CASCADE' })
      }
    }

  });

  return Team;
};
