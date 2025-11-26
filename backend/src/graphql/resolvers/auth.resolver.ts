import { GraphQLContext } from '../context';
import { requireAuth } from '../../middlewares/authentication';
import { requirePermission } from '../../middlewares/authorization';
import usersService from '../../modules/users/users.service';

export const authResolvers = {
    Query: {
        me: async (_: any, __: any, context: GraphQLContext) => {
            const user = requireAuth(context);
            return await usersService.findById(user.userId);
        },
    },

    Mutation: {
        login: async (_: any, { email, password }: { email: string; password: string }) => {
            const result = await usersService.login(email, password);
            return result;
        },

        registerUser: async (
            _: any,
            { input }: { input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'CREATE_USER');

            const newUser = await usersService.createUser({
                name: input.name,
                email: input.email,
                password: input.password,
                role: input.role,
                phone: input.phone,
            });

            // Don't return password hash
            const { passwordHash, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        },
    },
};
