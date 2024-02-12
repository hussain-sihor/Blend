import React, { useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import axios from "axios";
const Contact = ({ chat, index, currentUser, chatId }) => {
	const router = useRouter();

	const otherMember = chat?.members?.filter(
		(member) => member._id !== currentUser._id
	);

	const lastMessage =
		chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];
	const seen = lastMessage?.isSeen;

	const data = otherMember[0]?.username;
	const username = data[0].toUpperCase() + data.slice(1);
	const seenMsg = async () => {
		if (lastMessage && lastMessage.sender !== currentUser._id) {
			const result = await axios.post(`/api/messages/${lastMessage._id}`);
		}
	};
	const handlePushChat = async (chat) => {
		router.push(`/chats/${chat._id}`);
	};
	return (
		<div
			key={index}
			onClick={() => {
				handlePushChat(chat);
				seenMsg();
			}}
			className={`flex justify-between items-center rounded-lg shadow-md shadow-[#131324] px-2 py-1  ${
				chat._id == chatId ? "bg-[#98b6cf]" : "bg-[#d8ecfc]"
			} `}
		>
			<div className="flex justify-center items-center gap-3">
				{/* img  */}
				<div className="w-[4vw] h-[4vw] max-sm:h-[10vw] max-sm:w-[10vw] ">
					<img
						className="w-[4vw] rounded-full h-[4vw] flex justify-center items-center max-sm:h-[10vw] max-sm:w-[10vw]"
						src={`data:image/svg+xml;base64,${otherMember[0]?.avatar}`}
						alt=""
					/>
				</div>

				<div>
					<h3 className="font-bold text-lg text-neutral-800 cursor-default">
						{username}
					</h3>
					{/* lastMessage  */}
					{!lastMessage ? (
						<p className="font-medium cursor-default">
							Hii there lets get started
						</p>
					) : lastMessage?.photo ? (
						lastMessage?.sender == currentUser._id ? (
							<p className="font-medium cursor-default">You sent a photo</p>
						) : (
							<p className="font-medium cursor-default">You recieved a photo</p>
						)
					) : (
						<p className="font-medium cursor-default overflow-hidden max-w-[15vw]  h-7">
							{lastMessage?.text}
						</p>
					)}
				</div>
			</div>

			{/* date isSeen */}
			<div className="flex justify-center items-center flex-col gap-2 cursor-default">
				{!lastMessage
					? format(new Date(chat?.createdAt), "p")
					: format(new Date(chat?.lastMessageAt), "p")}

				{!seen && lastMessage && lastMessage.sender !== currentUser._id && (
					<div className="w-[9px] h-[9px] bg-green-500 rounded-full"></div>
				)}
			</div>
		</div>
	);
};

export default Contact;
