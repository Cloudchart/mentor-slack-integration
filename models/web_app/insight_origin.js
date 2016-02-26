'use strict';

module.exports = function(sequelize, DataTypes) {
  var InsightOrigin = sequelize.define('InsightOrigin', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    url: DataTypes.TEXT,
    title: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    author: DataTypes.STRING

  }, {

    tableName: 'insight_origins',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return InsightOrigin;
};
