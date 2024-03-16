//api/users
//to get all users for displaying chats
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const dynamic = "force-dynamic";
export const GET = async (req) => {
	try {
		await connectDB();

		const users = await User.find();

		return new Response(JSON.stringify(users), { status: 201 });
	} catch (error) {
		return new Response(error, { status: 500 });
	}
};
