'use strict';

module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
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
        Question.belongsTo(models.Survey, { foreignKey: 'surveyId' })
        Question.hasMany(models.Answer, { foreignKey: 'questionId', onDelete: 'CASCADE' })
      }
    }

  });

  return Question;
};
