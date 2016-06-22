'use strict';

module.exports = function(sequelize, DataTypes) {
  var SurveyAnswerUser = sequelize.define('SurveyAnswerUser', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    surveyId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    surveyAnswerId: {
      type: DataTypes.UUID,
      allowNull: false
    }

  }, {

    indexes: [{
      unique: true,
      fields: ['userId', 'surveyAnswerId'],
    }],

    classMethods: {
      associate: function(models) {
        SurveyAnswerUser.belongsTo(models.SurveyAnswer, { foreignKey: 'surveyAnswerId' })
      }
    }

  });

  return SurveyAnswerUser;
};
