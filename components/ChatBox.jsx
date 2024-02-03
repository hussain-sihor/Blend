import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const Contact = ({ chat, index, currentUser, chatId }) => {
	const router = useRouter();

	const otherMember = chat?.members?.filter(
		(member) => member._id !== currentUser._id
	);
	const lastMessage =
		chat?.message?.length > 0 && chat?.messages[chat?.message.length - 1];

	const data = otherMember[0]?.username;
	const username = data[0].toUpperCase() + data.slice(1);

	const handlePushChat = async (chat) => {
		router.push(`/chats/${chat._id}`);
	};
	return (
		<div
			key={index}
			onClick={() => {
				handlePushChat(chat);
			}}
			className={`flex justify-between items-center rounded-lg 
								shadow-lg shadow-slate-800 px-2 py-1 ${
									chat._id == chatId ? "bg-slate-400" : "bg-slate-200"
								} `}
		>
			<div className="flex justify-center items-center gap-3">
				<div className="w-[4vw] h-[4vw] ">
					<img
						className="w-[4vw] rounded-full h-[4vw] flex justify-center items-center"
						src={`data:image/svg+xml;base64,${otherMember[0]?.avatar}`}
						alt=""
					/>
				</div>
				<div>
					<h3 className="font-bold text-lg text-neutral-800 cursor-default">
						{username}
					</h3>
					{!lastMessage ? (
						<p className="font-medium cursor-default">
							Hii there lets get started{" "}
						</p>
					) : (
						<p className="font-medium cursor-default">{lastMessage}</p>
					)}
				</div>
			</div>

			<div className="flex justify-center items-center flex-col gap-2 cursor-default">
				{!lastMessage
					? format(new Date(chat?.createdAt), "p")
					: format(new Date(chat?.lastMessageAt), "p")}

				{/* <div className="w-[9px] h-[9px] bg-green-500 rounded-full"></div> */}
			</div>
		</div>
	);
};

export default Contact;
