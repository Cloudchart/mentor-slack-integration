'use strict';

module.exports = function(sequelize, DataTypes) {
  var UserThemeInsight = sequelize.define('UserThemeInsight', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    theme_id: DataTypes.UUID,
    insight_id: DataTypes.UUID,
    rate: DataTypes.INTEGER

  }, {

    tableName: 'users_themes_insights',
    underscored: true,

    classMethods: {
      associate: function(models) {
        UserThemeInsight.belongsTo(models.UserTheme, { foreignKey: 'theme_id', targetKey: 'theme_id' })
      }
    }
  });

  return UserThemeInsight;
};
