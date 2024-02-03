"use client";

import React from "react";
import ChatList from "../page";
import { useParams } from "next/navigation";
import ChatScreen from "@/components/ChatScreen";

const page = () => {
	const { chatId } = useParams();

	return (
		<div className="flex ">
			<ChatList chatId={chatId} />
			<ChatScreen chatId={chatId} />
		</div>
	);
};

export default page;
