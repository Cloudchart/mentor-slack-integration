'use strict';

module.exports = function(sequelize, DataTypes) {
  var SlackChannel = sequelize.define('SlackChannel', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    user_id: DataTypes.UUID

  }, {

    tableName: 'slack_channels',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return SlackChannel;
};
