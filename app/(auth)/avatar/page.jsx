"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import multiavatar from "@multiavatar/multiavatar";



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
		// if user visits again
		if (user?.avatar) {
			router.push("/chats");
			return;
		}
		const getImages = async () => {
			const arr = [];
			for(let i=0 ; i<4 ; i++){
				let str =  Math.random().toString(36).substring(2, 10);
				let image = multiavatar(str);
				arr.push(image);
			}
			setAvatars(arr);
			// console.log(arr);
		};
		getImages();
	}, []);
	return (
		<div className="w-full h-screen flex flex-col justify-center items-center text-[#131324]">
			<div className="w-[50vw] h-[60vh] flex flex-col justify-center items-center bg-[#dce6ee] gap-[3.5vh] rounded-xl shadow-lg shadow-[#6a6ab9] ring-offset-[#6a6ab9] ring-2 max-sm:w-[85%] max-sm:h-[50vh] max-sm:gap-6">
				<div>
					<h3 className="font-bold text-2xl max-sm:text-lg">
						<span className="text-[#6a6ab9] fontt-bold ">{username}</span>{" "}
						select an Avatar
					</h3>
				</div>
				<div className="flex gap-[2vw] max-sm:gap-3">
					{/* displaying avatars  */}
						{avatars.map((avatar, index) => {
						return (
							<div
								className={` w-[10vw] h-[10vw] flex justify-center items-center max-sm:w-[17vw] max-sm:h-[17vw] border-[6px] border-slate-950 rounded-full shadow-lg shadow-[#131324] border-opacity-5 ${isSelected === index ?  "w-[10vw] h-[10vw] max-sm:w-[17vw] max-sm:h-[17vw]"
											: "w-[9vw] h-[9vw] max-sm:w-[15vw] max-sm:h-[15vw]"}`}
									onClick={() => {
										setIsSelected(index);
									}}
								key={index} dangerouslySetInnerHTML={{__html:avatar}}
							>
								{/* <img
									//by default to show avatars
									src= {avatar}
									alt="avatar"
									onClick={() => {
										setIsSelected(index);
									}}
									//changing size dynamically based on selected or not
									className={` rounded-full border-[6px] shadow-lg border-opacity-5 border-slate-900 shadow-[#131324] max-sm:border-2 ${
										isSelected === index
											? "w-[10vw] h-[10vw] max-sm:w-[17vw] max-sm:h-[17vw]"
											: "w-[9vw] h-[9vw] max-sm:w-[15vw] max-sm:h-[15vw]"
									}`}
								/> */}
							</div>
						);
					})}
				
				</div>
				<button
					onClick={setProfile}
					className="px-4 py-2 w-[30%] bg-[#6a6ab9] text-lg text-[#131324] rounded-lg font-semibold
					 max-sm:w-[35%] max-sm:py-1 max-sm:text-sm"
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default profilePage;
