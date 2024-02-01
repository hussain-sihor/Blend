"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const profilePage = () => {
	const router = useRouter();
	//customizing toast for using here
	const toastOptions = {
		position: "bottom-right",
		theme: "dark",
		pauseOnHover: false,
		draggable: true,
		autoClose: 4000,
	};
	const [avatars, setAvatars] = useState([]);
	const [isSelected, setIsSelected] = useState(undefined);

	const { data: session } = useSession();
	const user = session?.user;
	const username = user?.username.toUpperCase();

	// any unique numbers after this api will generate avatars
	const api = "https://api.multiavatar.com";

	const setProfile = async () => {
		if (isSelected === undefined) {
			toast.error("Please select an Avatar", toastOptions);
		} else {
			console.log("avatar...", avatars[isSelected]);
			const result = await axios.post(`/api/setavatar/${user._id}`, {
				avatar: avatars[isSelected],
			});
			if (result.status == 200) {
				toast.success("Avatar saved successfully", toastOptions);
				router.push("/chats");
			} else {
				toast.error("Failed to set avatar", toastOptions);
			}
		}
	};
	useEffect(() => {
		// if (user?.avatar) {
		// 	router.push("/chats");
		// 	return;
		// }
		const getImages = async () => {
			const data = [];
			//needed 4 avatars to display
			for (let i = 0; i < 4; i++) {
				let image = await axios.get(
					`${api}/${Math.round(Math.random() * 1000)}`
				);
				//to store img temporally
				const buffer = new Buffer(image.data);
				data.push(buffer.toString("base64"));
			}
			setAvatars(data);
		};
		getImages();
	}, []);
	return (
		<div className="w-full h-screen flex flex-col justify-center items-center text-[#131324]">
			<div className="w-[50vw] h-[60vh] flex flex-col justify-center items-center bg-slate-200 gap-[3.5vh] rounded-xl">
				<div className="font-bold text-2xl">
					<h3>
						<span className="text-[#4e0eff]">{username}</span> select an Avatar
					</h3>
				</div>
				<div className="flex gap-[2vw]">
					{/* displaying avatars  */}
					{avatars.map((avatar, index) => {
						return (
							<div className=" w-[10vw] h-[10vw]" key={index}>
								<img
									//by default to show avatars
									src={`data:image/svg+xml;base64,${avatar}`}
									alt="avatar"
									onClick={() => {
										setIsSelected(index);
									}}
									//changing size dynamically based on selected or not
									className={` rounded-full  border-[6px] shadow-lg border-opacity-5 border-slate-800 shadow-[#131324] ${
										isSelected === index
											? "w-[10vw] h-[10vw]"
											: "w-[9vw] h-[9vw]"
									}`}
								/>
							</div>
						);
					})}
				</div>
				<button
					onClick={setProfile}
					className="px-4 py-2 w-[30%] bg-[#4e0eff] text-lg text-slate-200 rounded-lg font-semibold"
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default profilePage;
