"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import ChatBox from "@/components/ChatBox";
import ContactBox from "@/components/ContactBox";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";

const ChatList = ({ chatId }) => {
	const router = useRouter();

	const { data: session } = useSession();
	const currentUser = session?.user;

	const [contacts, setContacts] = useState([]);
	const [chats, setChats] = useState([]);
	const [search, setSearch] = useState("");

	//to create a chatDB(currentUser-contact) if exsists moving to newUrl
	const handleChat = async (contact) => {
		const result = await axios.post("/api/chats", {
			currentUserId: currentUser._id,
			member: contact._id,
		});
		const chat = result.data;
		router.push(`/chats/${chat._id}`);
	};

	const getUsers = async () => {
		//   getting user based on if searched or normally all users
		let Users;
		if (search !== "") {
			Users = await axios.get("/api/searchContact/${search}", {
				cache: "no-store",
			});
		} else {
			Users = await axios.get("/api/users", { cache: "no-store" });
		}
		if (Users.status == 201) {
			const data = await Users.data;
			//filtering out current user
			setContacts(data.filter((contact) => contact._id !== currentUser._id));
		}
		//   getting chats of currentUser
		const Chats = await axios.get(`/api/users/${currentUser._id}`, {
			cache: "no-store",
		});
		setChats(Chats.data);
	};

	useEffect(() => {
		if (currentUser) {
			getUsers();
		}
	}, [currentUser, search]);

	useEffect(() => {
		if (currentUser) {
			pusherClient.subscribe(currentUser._id);

			const handleChatUpdate = (updatedChat) => {
				setChats((prevChats) =>
					prevChats.map((chat) => {
						if (chat._id === updatedChat.id) {
							return { ...chat, messages: updatedChat.messages };
						} else {
							return chat;
						}
					})
				);
			};

			pusherClient.bind("updated-chat", handleChatUpdate);

			return () => {
				pusherClient.unsubscribe(currentUser._id);
				pusherClient.unbind("updated-chat", handleChatUpdate);
			};
		}
	}, [currentUser]);

	return (
		<div className="w-[30vw] h-[92vh] flex justify-center items-center  flex-col bg-[#131324] max-sm:w-full">
			<div className="  flex justify-start w-[95%] h-[95%] bg-[#6a6ab9]  flex-col px-4 rounded-lg shadow-sm shadow-slate-700 overflow-y-scroll py-6 no-scrollbar max-sm:rounded-xl">
				<input
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
					}}
					type="text"
					placeholder="Search contacts"
					className="px-6 py-3 bg-[#dce6ee] rounded-md shadow-md shadow-[#131324] max-sm:py-2"
				/>

				{/*          displaying chats         */}
				{chats.length > 0 && search == "" && (
					<div className="flex mt-4 gap-4 flex-col w-full">
						<div>
							<p className="text-[#dfebf5] font-semibold text-lg cursor-default">
								Chats...
							</p>
						</div>

						{chats.map((chat, index) => (
							<ChatBox
								chat={chat}
								index={index}
								currentUser={currentUser}
								chatId={chatId}
							/>
						))}
					</div>
				)}

				{/*          displaying contacts       */}
				<div className=" flex mt-4 gap-4 flex-col w-full">
					<div>
						<p className="text-[#dfebf5] font-semibold text-lg cursor-default">
							All Users...
						</p>
					</div>
					{contacts.map((user, index) => (
						<ContactBox
							createChat={handleChat}
							currentUser={currentUser}
							user={user}
							index={index}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default ChatList;
