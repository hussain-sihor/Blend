"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const ContactList = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const currentUser = session?.user;
	const [contacts, setContacts] = useState([]);
	const [search, setSearch] = useState("");
	const getAllUsers = async () => {
		const result = await axios.get(
			search !== "" ? `/api/searchContact/${search}` : "/api/users"
		);

		if (result.status == 201) {
			const data = await result.data;
			setContacts(data.filter((contact) => contact._id !== currentUser._id));
		}
	};

	const createChat = async (contact) => {
		const result = await axios.post("/api/chats", {
			currentUserId: currentUser._id,
			member: contact._id,
		});

		const chat = result.data;
		router.push(`/chats/${chat._id}`);
	};
	useEffect(() => {
		if (currentUser) {
			getAllUsers();
		}
	}, [currentUser, search]);

	return (
		<div className="w-[30vw] h-screen flex justify-center items-center">
			<div className="flex justify-start w-[95%] h-[95%] bg-[#131324]  flex-col px-4 pt-6 rounded-lg shadow-sm shadow-slate-700">
				<input
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
					}}
					type="text"
					placeholder="Search contacts"
					className="px-6 py-3 bg-slate-200 rounded-md border-2 border-slate-800"
				/>
				{contacts.length > 0 ? (
					<div className=" flex mt-4 gap-4 flex-col w-full">
						{contacts.map((user) => (
							<div
								onClick={() => {
									createChat(user);
								}}
								className="flex justify-between bg-slate-200 items-center rounded-lg 
								shadow-lg shadow-slate-800 px-2 py-1"
							>
								<div className="flex justify-center items-center gap-3">
									<div className="w-[4vw] h-[4vw] ">
										<img
											className="w-[4vw] rounded-full h-[4vw] flex justify-center items-center"
											src={`data:image/svg+xml;base64,${user.avatar}`}
											alt=""
										/>
									</div>
									<div>
										<h3 className="font-bold text-lg text-neutral-800">
											{user.username}
										</h3>
										<p className="font-medium">This is last message</p>
									</div>
								</div>

								<div className="flex justify-center items-center flex-col gap-2">
									<p className="font-medium text-sm text-slate-800">5:47 PM</p>
									<div className="w-[9px] h-[9px] bg-green-500 rounded-full"></div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="w-full flex justify-center items-center font-semibold text-xl h-full text-slate-200">
						No contacts found
					</div>
				)}
			</div>
		</div>
	);
};

export default ContactList;
