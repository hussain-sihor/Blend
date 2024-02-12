import Message from "@/models/Message";
import { connectDB } from "@/mongodb";

export const POST = async (req, { params }) => {
	try {
		await connectDB();
		const { messageId } = params;
		// const { messageId } = await req.json();

		const updateChat = await Message.findByIdAndUpdate(messageId, {
			isSeen: true,
		});
		return new Response(updateChat, { status: 201 });
	} catch (error) {
		return new Response("Falied to update isSeen", { status: 500 });
	}
};
