import _ from "lodash";
import { tryLogin } from "../auth";
import formatErrors from "../formatErrors";

export default {
  Query: {
    getUser: (parent, args, { models }) =>
      models.User.findOne({ where: { id: args.id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },

  Mutation: {
    createUser: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    },
    loginUser: async (
      parent,
      { email, password },
      { models, secret1, secret2 }
    ) => tryLogin(email, password, models, secret1, secret2)
  }
};
