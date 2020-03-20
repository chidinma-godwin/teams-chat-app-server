export default (sequelize, DataTypes) => {
  const Team = sequelize.define("team", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: [3, 100],
          msg: "Team name must be between 3 and 100 characters long"
        }
      }
    }
  });

  Team.associate = models => {
    Team.belongsToMany(models.User, {
      through: "member",
      foreignKey: "teamId"
    });
    Team.belongsTo(models.User, {
      foreignKey: "owner"
    });
  };
  return Team;
};
