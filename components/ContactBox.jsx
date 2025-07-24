const ContactBox = ({ currentUser, user, index, createChat }) => {
	const data = user?.username;
	const username = data[0].toUpperCase() + data.slice(1);
	return (
		<div
			key={index}
			onClick={() => {
				createChat(user);
			}}
			className="flex justify-start bg-[#dce6ee] items-center rounded-lg 
      shadow-md shadow-[#131324] px-2 py-1 max-sm:py-2"
		>
			<div className="w-[4vw] h-[4vw] max-sm:w-[10vw] max-sm:h-[10vw] flex justify-center items-center">
				<div className="w-[4vw] rounded-full h-[4vw] flex justify-center items-center max-sm:w-[8vw] max-sm:h-[8vw]"
					dangerouslySetInnerHTML={{__html:user?.avatar}}
				/>
			</div>
			<div className=" w-full ml-[1vw]">
				<h3 className="font-semibold text-xl text-[#131324]  cursor-default">
					{username}
				</h3>
			</div>
		</div>
	);
};

export default ContactBox;
