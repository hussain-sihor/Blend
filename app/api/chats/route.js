import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const POST = async (req) => {
	try {
		await connectDB();
		const { currentUserId, member } = await req.json();
		//finding if chats already present
		const query = { members: { $all: [currentUserId, member] } };
		let chat = await Chat.findOne(query);

		if (!chat) {
			chat = await new Chat({
				members: [currentUserId, member],
				//createdAt updatedAt will be given by default
				//messages[] will be updated later
			});

			await chat.save();

			//giving chatId to each users
			await User.findByIdAndUpdate(
				currentUserId,
				{
					$addToSet: { chats: chat._id },
				},
				{ new: true }
			);
		}
		return new Response(JSON.stringify(chat), { status: 201 });
	} catch (error) {
		return new Response("Failed to make a chat", { status: 500 });
	}
};
