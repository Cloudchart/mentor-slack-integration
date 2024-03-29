'use strict';

module.exports = function(sequelize, DataTypes) {
  var SurveyResult = sequelize.define('SurveyResult', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    surveyId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    title: {
      type: DataTypes.STRING
    },

    text: {
      type: DataTypes.TEXT
    },

    imageUid: {
      type: DataTypes.STRING
    }

  }, {

    classMethods: {
      associate: function(models) {
        SurveyResult.belongsTo(models.Survey, { foreignKey: 'surveyId' })
      }
    }

  });

  return SurveyResult;
};
