'use strict';

module.exports = function(sequelize, DataTypes) {
  var ChannelNotification = sequelize.define('ChannelNotification', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    channelId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {

    indexes: [{
      fields: ['channelId'],
    }],

    classMethods: {
      associate: function(models) {
        ChannelNotification.belongsTo(models.Channel, { foreignKey: 'channelId' })
      }
    }

  });

  return ChannelNotification;
};
