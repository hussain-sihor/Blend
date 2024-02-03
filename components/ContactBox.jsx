const ContactBox = ({ currentUser, user, index, createChat }) => {
	const data = user?.username;
	const username = data[0].toUpperCase() + data.slice(1);
	return (
		<div
			key={index}
			onClick={() => {
				createChat(user);
			}}
			className="flex justify-start bg-slate-200 items-center rounded-lg 
      shadow-lg shadow-slate-800 px-2 py-1"
		>
			<div className="w-[4vw] h-[4vw] ">
				<img
					className="w-[4vw] rounded-full h-[4vw] flex justify-center items-center"
					src={`data:image/svg+xml;base64,${user?.avatar}`}
					alt=""
				/>
			</div>
			<div className=" w-full ml-[1vw]">
				<h3 className="font-semibold text-xl text-neutral-800 cursor-default">
					{username}
				</h3>
			</div>
		</div>
	);
};

export default ContactBox;
