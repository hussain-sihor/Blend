import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const GET = async (req, { params }) => {
	try {
		await connectDB();
		const { chatId } = params;
		const chat = await Chat.findById(chatId)
			.populate({
				path: "members",
				model: User,
			})
			.exec();
		return new Response(JSON.stringify(chat), { status: 201 });
	} catch (error) {
		return new Response("Failed top get chats", { status: 500 });
	}
};
