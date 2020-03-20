const createResolver = resolver => {
  // Save the argument as the base resolver
  const baseResolver = resolver;

  // Add a createResolver function that takes a childResolver as argument to the base resolver
  baseResolver.createResolver = childResolver => {
    // Create a new resolver
    const newResolver = async (parent, args, context, info) => {
      // Resolver the base resolver first
      await resolver(parent, args, context, info);

      // Then resolve the child resolver afterwards and return it
      return childResolver(parent, args, context, info);
    };

    return createResolver(newResolver);
  };

  return baseResolver;
};

// Export a base resolver that will require users to be authenticated
export default createResolver((parent, args, context) => {
  console.log(context);
  if (!context.user || !context.user.id) throw new Error("Not Authenticated");
});
