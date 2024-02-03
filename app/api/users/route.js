//api/users
//to get all users for displaying chats
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const GET = async () => {
	try {
		await connectDB();

		const users = await User.find();

		return new Response(JSON.stringify(users), { status: 201 });
	} catch (error) {
		return new Response(error, { status: 500 });
	}
};
