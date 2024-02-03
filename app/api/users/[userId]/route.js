//to get al chats of a user
import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const GET = async (req, { params }) => {
	try {
		await connectDB();

		const { userId } = await params;
		// console.log(params);
		const allChats = await Chat.find({ members: userId })
			.sort({ lastMessageAt: -1 })
			.populate({
				path: "members",
				model: User,
			})
			.exec();

		return new Response(JSON.stringify(allChats), { status: 201 });
	} catch (error) {
		return new Response("Failed to get chats", { status: 500 });
	}
};
