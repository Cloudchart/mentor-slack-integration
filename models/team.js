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
    }

  }, {

    classMethods: {
      associate: function(models) {
      }
    }

  });

  return Team;
};
