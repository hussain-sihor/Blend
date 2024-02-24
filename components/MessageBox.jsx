import { format } from "date-fns";
import React from "react";

const MessageBox = ({ index, message, currentUser }) => {
	return message?.sender === currentUser._id ? (
		<div className="flex justify-end items-center gap-1" key={index}>
			{message?.text ? (
				<p className="rounded-xl bg-[#131324] text-[#dce6ee] text-md font-semibold py-2 px-4 max-w-[55vw] max-sm:text-sm max-sm:font-normal max-sm:max-w-[75vw]">
					{message?.text}
				</p>
			) : (
				<img
					src={message?.photo}
					className={`border-[6px] max-h-44 max-w-[25vw] rounded-xl border-[#131324]`}
				/>
			)}
			<p className="max-sm:text-sm">
				{format(new Date(message?.createdAt), "p")}
			</p>
		</div>
	) : (
		<div className="flex items-center gap-1 " key={index}>
			{message?.text ? (
				<p className="rounded-xl bg-[#6a6ab9] text-slate-900 text-md font-semibold py-2 px-4 max-w-[55vw]  max-sm:text-sm max-sm:font-normal max-sm:max-w-[75vw]">
					{message?.text}
				</p>
			) : (
				<img
					src={message?.photo}
					alt="message"
					className={`border-[6px] max-h-44 max-w-[25vw] rounded-xl border-[#6a6ab9] `}
				/>
			)}
			<p className="max-sm:text-sm">
				{format(new Date(message?.createdAt), "p")}
			</p>
		</div>
	);
};

export default MessageBox;
