'use strict';

module.exports = function(sequelize, DataTypes) {
  var Survey = sequelize.define('Survey', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {

    classMethods: {
      associate: function(models) {
        Survey.hasMany(models.Question, { foreignKey: 'surveyId', onDelete: 'CASCADE' })
      }
    }

  });

  return Survey;
};
