"use client";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }) => {
	return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;

//getting children and session and wrapping it in SessionProvider so childrens can access the data
