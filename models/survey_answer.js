'use strict';

module.exports = function(sequelize, DataTypes) {
  var SurveyAnswer = sequelize.define('SurveyAnswer', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    surveyQuestionId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING
    },

    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {

    classMethods: {
      associate: function(models) {
        SurveyAnswer.belongsTo(models.SurveyQuestion, { foreignKey: 'surveyQuestionId' })
      }
    }

  });

  return SurveyAnswer;
};
