import Sequelize from "sequelize";

const sequelize = new Sequelize("slack", "postgres", "math2SUWA", {
  host: "localhost",
  dialect: "postgres",
  define: {
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
