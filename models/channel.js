'use strict';

module.exports = function(sequelize, DataTypes) {
  var Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    teamId: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {

    indexes: [{
      fields: ['teamId']
    }],

    classMethods: {
      associate: function(models) {
        Channel.belongsTo(models.Team, { foreignKey: 'teamId' })
      }
    }

  });

  return Channel;
};
