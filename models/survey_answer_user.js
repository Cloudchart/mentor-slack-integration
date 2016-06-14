'use strict';

module.exports = function(sequelize, DataTypes) {
  var SurveyAnswerUser = sequelize.define('SurveyAnswerUser', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    surveyAnswerId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    isCorrect: {
      type: DataTypes.BOOLEAN
    }

  }, {

    classMethods: {
      associate: function(models) {
        SurveyAnswerUser.belongsTo(models.SurveyAnswer, { foreignKey: 'surveyAnswerId' })
      }
    }

  });

  return SurveyAnswerUser;
};
