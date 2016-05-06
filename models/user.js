'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
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
    },

    lastTimestamp: {
      type: DataTypes.STRING
    },

    hasNewMessage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {

    indexes: [{
      fields: ['teamId'],
    }],

    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Team, { foreignKey: 'teamId' })
        User.hasMany(models.MessagesUser, { foreignKey: 'userId', onDelete: 'CASCADE' })
      }
    }

  });

  return User;
};
