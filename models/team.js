'use strict';

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('Team', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    responseBody: DataTypes.TEXT,
  }, {

    classMethods: {
      associate: function(models) {
        Team.hasMany(models.Channel)
      }
    }

  });

  return Team;
};
