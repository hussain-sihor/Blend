import { pusherServer } from "@/lib/pusher";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const dynamic = "force-dynamic";
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

		const newMessage = await Message.findById(newMsg._id).populate({
			path: "sender",
			model: User,
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
			})
			.populate({
				path: "members",
				model: User,
			})
			.exec();

		//triggering pusher event named new-message through channel chatId and sending newMsg which is response of the api call
		await pusherServer.trigger(chatId, "new-message", newMsg);

		// triggering pusher event to update lastmessage
		const lastMessage = updateChat.messages[updateChat.messages.length - 1];

		updateChat.members.forEach(async (member) => {
			try {
				await pusherServer.trigger(member._id.toString(), "updated-chat", {
					id: chatId,
					messages: [lastMessage],
				});
			} catch (err) {
				console.log(err);
			}
		});

		return new Response(JSON.stringify(newMessage), { status: 201 });
	} catch (error) {
		return new Response("Failed to create a message", { status: 500 });
	}
};
