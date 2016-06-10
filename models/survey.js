'use strict';

var slugify = require('underscore.string').slugify

module.exports = function(sequelize, DataTypes) {
  var Survey = sequelize.define('Survey', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      set: function(value) {
        this.setDataValue('name', value)
        this.setDataValue('slug', slugify(value))
      }
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {

    classMethods: {
      associate: function(models) {
        Survey.hasMany(models.SurveyQuestion, { foreignKey: 'surveyId', onDelete: 'CASCADE' })
        Survey.hasMany(models.SurveyResult, { foreignKey: 'surveyId', onDelete: 'CASCADE' })
      }
    }

  });

  return Survey;
};
