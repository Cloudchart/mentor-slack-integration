'use strict';

module.exports = function(sequelize, DataTypes) {
  var Insight = sequelize.define('Insight', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    content: DataTypes.TEXT

  }, {

    tableName: 'insights',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Insight;
};
