import { pusherServer } from "@/lib/pusher";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const POST = async (req) => {
	try {
		await connectDB();
		const { chatId, currentUserId, text, photo } = await req.json();

		const newMsg = await Message.create({
			chat: chatId,
			sender: currentUserId,
			photo,
			text,
		});

		const updateChat = await Chat.findByIdAndUpdate(
			chatId,
			{
				$push: { messages: newMsg._id },
				$set: { lastMessageAt: newMsg.createdAt },
			},
			{ new: true }
		)
			.populate({
				path: "messages",
				model: Message,
				populate: {
					path: "sender",
					model: User,
				},
			})
			.populate({
				path: "members",
				model: User,
			})
			.exec();

		//triggering pusher event named new-message through channel chatId and sending newMsg which is response of the api call
		await pusherServer.trigger(chatId, "new-message", newMsg);

		return new Response(JSON.stringify(newMsg), { status: 201 });
	} catch (error) {
		return new Response("Failed to create a message", { status: 500 });
	}
};
