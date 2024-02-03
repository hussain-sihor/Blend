"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import ChatBox from "@/components/ChatBox";
import ContactBox from "@/components/ContactBox";
import { useRouter } from "next/navigation";

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
		const Users = await axios.get(
			search !== "" ? `/api/searchContact/${search}` : "/api/users"
		);
		if (Users.status == 201) {
			const data = await Users.data;
			//filtering out current user
			setContacts(data.filter((contact) => contact._id !== currentUser._id));
		}
		//   getting chats of currentUser
		const Chats = await axios.get(`/api/users/${currentUser._id}`);
		setChats(Chats.data);
	};

	useEffect(() => {
		if (currentUser) {
			getUsers();
		}
	}, [currentUser, search]);

	return (
		<div className="w-[30vw] h-screen flex justify-center items-center bg-green-300 flex-col">
			<div className="flex justify-start w-[95%] h-[95%] bg-[#131324]  flex-col px-4 rounded-lg shadow-sm shadow-slate-700 overflow-y-scroll py-6">
				<input
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
					}}
					type="text"
					placeholder="Search contacts"
					className="px-6 py-3 bg-slate-200 rounded-md border-2 border-slate-800"
				/>

				{/*          displaying chats         */}
				{chats.length > 0 && search == "" && (
					<div className="flex mt-4 gap-4 flex-col w-full">
						<div>
							<p className="text-slate-200 font-semibold text-lg cursor-default">
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
						<p className="text-slate-200 font-semibold text-lg cursor-default">
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
