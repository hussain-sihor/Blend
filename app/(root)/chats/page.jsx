"use client";
import ContactList from "@/components/ContactList";
import { useSession } from "next-auth/react";

const Chats = () => {
	const { data: session } = useSession();
	// console.log(session);

	return (
		<div className="w-full h-screen bg-slate-800">
			<ContactList />
		</div>
	);
};

export default Chats;
