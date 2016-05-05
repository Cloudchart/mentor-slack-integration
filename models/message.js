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

    timestamp: {
      type: DataTypes.STRING,
      allowNull: false
    },

    responseBody: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    topicId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    insightId: {
      type: DataTypes.STRING,
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
