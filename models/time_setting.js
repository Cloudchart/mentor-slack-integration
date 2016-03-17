'use strict';

var daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

module.exports = function(sequelize, DataTypes) {
  var TimeSetting = sequelize.define('TimeSetting', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    teamId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    tz: {
      // TODO: add validation
      type: DataTypes.STRING,
      allowNull: false
    },

    startTime: {
      // TODO: add validation
      type: DataTypes.STRING(5),
      allowNull: false
    },

    endTime: {
      // TODO: add validation
      type: DataTypes.STRING(5),
      allowNull: false
    },

    daysMask: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    days: {
      type: DataTypes.VIRTUAL,
      set: function(selectedDays) {
        var daysIntersection = daysOfWeek.filter(function(day) {
          return selectedDays.indexOf(day) != -1;
        });
        var result = daysIntersection.reduce(function(memo, day) {
          return memo + Math.pow(2, daysOfWeek.indexOf(day));
        }, 0)

        this.setDataValue('daysMask', result);
      },
      get: function() {
        var self = this;
        return daysOfWeek.filter(function(day) {
          return (self.getDataValue('daysMask') & Math.pow(2, daysOfWeek.indexOf(day))) !== 0;
        });
      }
    }

  }, {

    indexes: [{
      fields: ['teamId'],
    }],

    classMethods: {
      associate: function(models) {
        TimeSetting.belongsTo(models.Team, { foreignKey: 'teamId' })
      }
    }

  });

  return TimeSetting;
};
