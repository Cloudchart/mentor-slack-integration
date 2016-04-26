'use strict';

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('Team', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    name: DataTypes.STRING,

    accessToken: {
      type: DataTypes.STRING,
      allowNull: false
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
        Team.hasOne(models.TeamOwner, { foreignKey: 'teamId', onDelete: 'CASCADE' })
        Team.hasOne(models.TimeSetting, { foreignKey: 'teamId', onDelete: 'CASCADE' })
      }
    }

  });

  return Team;
};
