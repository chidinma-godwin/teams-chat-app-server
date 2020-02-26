export default {
    Query: {
        getUser: (parent, args, { models }) => models.User.findOne({ where: { id: args.id }}),
        allUsers: (parent, args, { models }) => models.User.findAll()
    },

    Mutation: {
        createUser: (parent, args, { models }) => models.User.create(args)
    }
};