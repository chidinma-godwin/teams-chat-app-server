import formatErrors from "../formatErrors";
import requireAuthentication from "../permissions";

export default {
  Query: {
    allTeams: requireAuthentication.createResolver(
      (parent, args, { models, user }) =>
        models.Team.findAll({ where: { owner: user.id } })
    )
  },

  Mutation: {
    createTeam: requireAuthentication.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const team = await models.Team.create({ ...args, owner: user.id });
          const channelsToAdd = [
            {
              name: "general",
              public: true,
              teamId: team.id
            },
            {
              name: "random",
              public: true,
              teamId: team.id
            },
            {
              name: "announcements",
              public: true,
              teamId: team.id
            }
          ];
          await models.Channel.bulkCreate(channelsToAdd, { returning: true });
          return {
            ok: true,
            team
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatErrors(err, models)
          };
        }
      }
    ),
    addMember: async (parent, { teamId, email }, { models, user }) => {
      const teamPromise = models.Team.findOne(
        { where: { id: teamId } },
        { raw: true }
      );
      const userToAddPromise = models.User.findOne(
        { where: { email } },
        { raw: true }
      );
      const [team, userToAdd] = await Promise.all([
        teamPromise,
        userToAddPromise
      ]);
      try {
        if (team.owner !== user.id) {
          return {
            ok: false,
            errors: [
              { path: "email", message: "You cannot add members to this team" }
            ]
          };
        }

        if (!userToAdd) {
          return {
            ok: false,
            errors: [{ path: "email", message: "No user with this email" }]
          };
        }

        await models.Member.create({ userId: userToAdd.id, teamId });

        return {
          ok: true
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    }
  },

  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } })
  }
};
