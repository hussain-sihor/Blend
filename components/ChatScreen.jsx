"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { IoImages } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import axios from "axios";
import MessageBox from "./MessageBox";
import { CldUploadButton } from "next-cloudinary";
import { pusherClient } from "@/lib/pusher";
import { IoArrowBackOutline } from "react-icons/io5";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

const ChatScreen = ({ chatId }) => {
	const router = useRouter();
	const { data: session } = useSession();
	const currentUser = session?.user;
	const [chat, setChat] = useState({});
	const [text, setText] = useState("");
	const [otherMember, setOtherMember] = useState([]);
	const [showEmoji, setShowEmoji] = useState(false);

	const getChats = async () => {
		const result = await axios.get(`/api/chats/${chatId}`);
		const data = result.data;
		setChat(data);
		setOtherMember(
			data?.members?.filter((member) => member._id !== currentUser._id)
		);
	};

	const sendMsg = async () => {
		const result = await axios.post("/api/messages", {
			chatId,
			currentUserId: currentUser._id,
			text,
		});
		if ((result.status = 201)) {
			setText("");
		}
		console.log("result", result.data);
	};

	const sendPhoto = async (result) => {
		try {
			const res = axios.post("/api/messages", {
				chatId,
				currentUserId: currentUser._id,
				photo: result?.info?.secure_url,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleEmojiPicker = () => {
		setShowEmoji(!showEmoji);
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

	useEffect(() => {
		// chatId refers to channel name as describe in messages route
		pusherClient.subscribe(chatId);

		const handleNewMessage = async (newMsg) => {
			setChat((prevChat) => {
				return {
					...prevChat,
					messages: [...prevChat.messages, newMsg],
				};
			});
		};

		//  listening to event
		pusherClient.bind("new-message", handleNewMessage);

		return () => {
			pusherClient.unsubscribe(chatId),
				pusherClient.unbind("new-message", handleNewMessage);
		};
	}, [chatId]);

	// scrolling down when new msg
	const bottomRef = useRef(null);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [chat?.messages]);
	return (
		<div className="w-[70vw] h-[92vh] flex flex-col justify-center items-start bg-[#131324] max-sm:w-full">
			<div className="w-full">
				{/* profile */}
				<div className=" bg-[#131324] w-full justify-start items-center flex gap-6 px-5 py-2 h-[8vh] max-sm:h-[7vh] max-sm:gap-4 max-sm:py-1">
					<IoArrowBackOutline
						className="text-xl hidden max-sm:block text-white"
						onClick={() => {
							router.push("/chats");
						}}
					/>
					<div className="w-[3vw] h-[3vw] max-sm:h-[6vw] max-sm:w-[6vw]">
						<img
							className="w-[3vw] rounded-full h-[3vw] flex justify-center items-center max-sm:h-[6vw] max-sm:w-[6vw] "
							src={`data:image/svg+xml;base64,${otherMember[0]?.avatar}`}
						/>
					</div>
					<h3 className="font-bold text-lg text-[#d8ecfc] cursor-default max-sm:text-md">
						{username}
					</h3>
				</div>
				{/* Messages  */}
				<div className=" bg-[#d8ecfc] flex flex-col gap-8 p-4 overflow-y-scroll h-[75vh] mr-4 rounded-lg no-scrollbar max-sm:m-0 max-sm:rounded-sm z-0">
					{chat?.messages?.map((message, index) => (
						<MessageBox
							key={index}
							message={message}
							currentUser={currentUser}
						/>
					))}
					<div ref={bottomRef} />
				</div>
			</div>
			<div className=" p-2 z-10 absolute bottom-[9vh] max-sm:hidden">
				{showEmoji && (
					<EmojiPicker
						defaultSkinTone="1f3fc"
						onEmojiClick={(emoji) => {
							let msg = text;
							msg += emoji.emoji;
							setText(msg);
							handleEmojiPicker();
						}}
						className="absolute z-10"
					/>
				)}
			</div>
			<div className=" p-2 z-10 absolute bottom-[9vh] max-sm:block hidden">
				{showEmoji && (
					<EmojiPicker
						defaultSkinTone="1f3fc"
						width={300}
						height={400}
						onEmojiClick={(emoji) => {
							let msg = text;
							msg += emoji.emoji;
							setText(msg);
							handleEmojiPicker();
						}}
						className="absolute z-10"
					/>
				)}
			</div>
			{/* bottom */}
			<div className=" flex justify-center items-center gap-3 px-4 pr-4 pl-2 w-full bg-[#131324] h-[9vh] max-sm:py-1 max-sm:px-4 ">
				{/* Image  */}
				<div className=" h-full text-2xl flex justify-center items-center rounded-full max-sm:text-xl">
					<CldUploadButton
						options={{ maxFiles: 1 }}
						onUpload={sendPhoto}
						uploadPreset="hnurtglq"
					>
						<IoImages className="text-[#d8ecfc]" />
					</CldUploadButton>
				</div>
				{/* Emoji  */}
				<div className=" h-full text-2xl flex justify-center items-center rounded-full max-sm:text-xl">
					<BsEmojiHeartEyesFill
						className="text-[#d8ecfc] cursor-pointer"
						onClick={handleEmojiPicker}
					/>
				</div>

				{/* Input  */}
				<div className=" w-full h-full flex justify-center items-center">
					<input
						value={text}
						onChange={(e) => {
							setText(e.target.value);
						}}
						type="text"
						placeholder="Write a message..."
						className="w-full border-none py-3 px-6 outline-none rounded-lg bg-[#d8ecfc] max-sm:py-1 max-sm:px-2"
					/>
				</div>

				{/* send Btn  */}
				<div
					className=" h-full text-2xl flex justify-center items-center rounded-full max-sm:text-xl "
					onClick={sendMsg}
				>
					<TbSend className="text-[#d8ecfc] cursor-pointer" />
				</div>
			</div>
		</div>
	);
};

export default ChatScreen;
