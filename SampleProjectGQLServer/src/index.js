const {ApolloServer} = require('apollo-server');
const {PrismaClient} = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const resolvers = {
	Query: {
		info: () => `This is the API of a Sample app`,
		// user: () => `hello`,
		// user: async (parent,args,context) => {
		// 	return context.prisma.user.findMany()
		// }
		user: async (parent, args, context, info) => {
      		return context.prisma.user.findUnique({
        where: { id: Number(args.id) },
      });
    	}
	},
	Mutation: {
		updatePic: async (parent, args, context, info) => {
			return context.prisma.user.update({
				where: {id: Number(args.id)},
				data: {profilePic: String(args.profilePic)}
			})
		}
	}
}

const prisma = new PrismaClient()
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf-8'
    ),
    resolvers,
    context: {
        prisma,
      }
})

server
    .listen()
    .then(({url}) => 
        console.log(`server is running on ${url}`)
    );