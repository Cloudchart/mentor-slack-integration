'use strict';

module.exports = function(sequelize, DataTypes) {
  var SurveyQuestion = sequelize.define('SurveyQuestion', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    surveyId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {

    classMethods: {
      associate: function(models) {
        SurveyQuestion.belongsTo(models.Survey, { foreignKey: 'surveyId' })
        SurveyQuestion.hasMany(models.SurveyAnswer, { foreignKey: 'surveyQuestionId', onDelete: 'CASCADE' })
      }
    }

  });

  return SurveyQuestion;
};
