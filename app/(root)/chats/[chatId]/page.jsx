"use client";

import React from "react";
import { useParams } from "next/navigation";
import ChatScreen from "@/components/ChatScreen";
import ChatList from "@/components/ChatList";

const page = () => {
	const { chatId } = useParams();

	return (
		<div>
			<div className="hidden max-sm:block">
				<ChatScreen chatId={chatId} />
			</div>
			<div className="flex max-sm:hidden">
				<ChatList chatId={chatId} />
				<ChatScreen chatId={chatId} />
			</div>
		</div>
	);
};

export default page;
