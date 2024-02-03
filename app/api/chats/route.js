//api/chats
// for generating chat account between currentUser and a member
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
			});

			await chat.save();

			//giving chatId to each users
			const updateChatId = chat.members.map(async (memberId) => {
				await User.findByIdAndUpdate(
					memberId,
					{
						$addToSet: { chats: chat._id },
					},
					{ new: true }
				);
			});
			Promise.all(updateChatId);
		}
		return new Response(JSON.stringify(chat), { status: 201 });
	} catch (error) {
		return new Response("Failed to make a chat", { status: 500 });
	}
};
