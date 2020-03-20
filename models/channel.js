export default (sequelize, DataTypes) => {
  const Channel = sequelize.define("channel", {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Channel name required"
        }
      }
    },
    public: DataTypes.BOOLEAN
  });

  Channel.associate = models => {
    Channel.belongsTo(models.Team, {
      foreignKey: "teamId"
    });
  };

  return Channel;
};
