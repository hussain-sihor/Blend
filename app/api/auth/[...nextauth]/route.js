import User from "@/models/User";
import { connectDB } from "@/mongodb";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

// validating user with next-auth
const handler = NextAuth({
	providers: [
		CredentialProvider({
			name: "Credentials",
			async authorize(credentials) {
				// input not given
				if (!credentials.email || !credentials.password) {
					throw new Error("Invalid email and password");
				}

				await connectDB();

				const user = await User.findOne({ email: credentials.email });
				// user not matching
				if (!user || !user?.password) {
					throw new Error("Invalid email or password");
				}

				const comparePassword = await compare(
					credentials.password,
					user.password
				);
				// password not matched
				if (!comparePassword) {
					throw new Error("Invalid password");
				}

				//all checks completed
				return user;
			},
		}),
	],
	//  bydefault session provides only email to get full details we need callback func and adding details from DB to session
	callbacks: {
		async session({ session }) {
			const databaseUser = await User.findOne({ email: session.user.email });
			session.user.id = databaseUser._id.toString();
			session.user = { ...session.user, ...databaseUser._doc };
			return session;
		},
	},
});

export { handler as GET, handler as POST };
