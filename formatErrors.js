import pick from "lodash/pick";

export default (e, models) => {
  if (e instanceof models.Sequelize.ValidationError) {
    return e.errors.map(x => pick(x, ["path", "message"]));
  }

  return [{ path: "unexpected", message: "Something went wrong" }];
};
