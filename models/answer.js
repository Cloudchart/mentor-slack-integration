'use strict';

module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    questionId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {

    classMethods: {
      associate: function(models) {
        Answer.belongsTo(models.Question, { foreignKey: 'questionId' })
      }
    }

  });

  return Answer;
};
