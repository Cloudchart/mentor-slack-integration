'use strict';

module.exports = function(sequelize, DataTypes) {
  var UserTheme = sequelize.define('UserTheme', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    theme_id: DataTypes.UUID,
    status: {
      type: DataTypes.ENUM,
      values: ['available', 'visible', 'subscribed', 'rejected']
    }
  }, {

    tableName:    'users_themes',
    underscored:  true,

    classMethods: {
      associate: function (models) {
      }
    }

  });

  return UserTheme;
};
