'use strict';

module.exports = function(sequelize, DataTypes) {
  var Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    }
  }, {

    classMethods: {
      associate: function(models) {
        Channel.belongsTo(models.Team)
      }
    }

  });

  return Channel;
};
