'use strict';

module.exports = function(sequelize, DataTypes) {
  var TeamOwner = sequelize.define('TeamOwner', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    teamId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    imId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    responseBody: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  }, {

    indexes: [{
      fields: ['teamId'],
    }],

    classMethods: {
      associate: function(models) {
        TeamOwner.belongsTo(models.Team, { foreignKey: 'teamId' })
        TeamOwner.hasMany(models.TeamOwnerNotification, { foreignKey: 'teamOwnerId', onDelete: 'CASCADE' })
      }
    }

  });

  return TeamOwner;
};
