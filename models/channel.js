'use strict';

module.exports = function(sequelize, DataTypes) {
  var Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    teamId: DataTypes.STRING,
  }, {

    classMethods: {
      associate: function(models) {
        Channel.belongsTo(models.Team, { foreignKey: 'teamId' })
      }
    }

  });

  return Channel;
};
