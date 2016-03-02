'use strict';

module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    channelId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userThemeInsightId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    timestamp: {
      type: DataTypes.STRING,
      allowNull: false
    },

    responseBody: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  }, {

    indexes: [{
      fields: ['channelId'],
    }],

    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.Channel, { foreignKey: 'channelId' })
      }
    }

  });

  return Message;
};
