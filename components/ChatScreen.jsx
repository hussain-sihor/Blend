"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoImages } from "react-icons/io5";
import { TbSend } from "react-icons/tb";

const ChatScreen = ({ chatId }) => {
	const { data: session } = useSession();
	const currentUser = session?.user;
	const [chat, setChat] = useState({});
	const [otherMember, setOtherMember] = useState([]);

	const getChats = async () => {
		const result = await axios.get(`/api/chats/${chatId}`);
		const data = result.data;
		setChat(data);
		setOtherMember(
			data?.members?.filter((member) => member._id !== currentUser._id)
		);
	};

	useEffect(() => {
		if (currentUser) {
			getChats();
		}
	}, [chatId, currentUser]);

	let username = "";
	const data = otherMember[0]?.username;
	if (data) {
		username = data[0].toUpperCase() + data.slice(1);
	}
	return (
		<div className="w-[70vw] h-screen flex flex-col justify-between items-start bg-green-200">
			<div className="w-full">
				<div className=" bg-gray-400 w-full justify-start items-center flex gap-6 px-5 py-2">
					<div className="w-[3vw] h-[3vw]">
						<img
							className="w-[3vw] rounded-full h-[3vw] flex justify-center items-center"
							src={`data:image/svg+xml;base64,${otherMember[0]?.avatar}`}
						/>
					</div>
					<h3 className="font-bold text-lg text-neutral-800 cursor-default">
						{username}
					</h3>
				</div>
			</div>
			<div className=" flex justify-center items-center gap-3 py-2  px-6 w-full bg-slate-200">
				<div className=" h-full text-2xl flex justify-center items-center rounded-full">
					<IoImages />
				</div>
				<div className=" w-full h-full">
					<input
						type="text"
						placeholder="Write a message..."
						className="w-full border-none py-3 px-6 outline-none rounded-lg"
					/>
				</div>
				<div className=" h-full  text-2xl flex justify-center items-center rounded-full ">
					<TbSend />
				</div>
			</div>
		</div>
	);
};

export default ChatScreen;
