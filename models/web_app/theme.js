'use strict';

module.exports = function(sequelize, DataTypes) {
  var Theme = sequelize.define('Theme', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    name: DataTypes.STRING,
    is_system: DataTypes.BOOLEAN,
    is_default: DataTypes.BOOLEAN,
    last_fetched_at: DataTypes.DATE

  }, {

    tableName: 'themes',
    underscored: true,

    classMethods: {
      associate: function(models) {
        Theme.hasMany(models.UserTheme)
      }
    }

  });

  return Theme;
};
