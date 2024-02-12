import ChatList from "@/components/ChatList";
import WelcomeScreen from "@/components/WelcomeScreen";
import React from "react";

const page = () => {
	return (
		<div className="flex">
			<ChatList />
			<WelcomeScreen />
		</div>
	);
};

export default page;
