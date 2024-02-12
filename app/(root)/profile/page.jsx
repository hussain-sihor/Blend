"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import { GrRevert } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Buffer } from "buffer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";

const ProfilePage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const user = session?.user;
	const [currentAvatar, setCurrentAvatar] = useState();
	const time = format(new Date(user?.createdAt), "dMMM-y");
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const toastOptions = {
		position: "bottom-right",
		theme: "dark",
		pauseOnHover: false,
		draggable: true,
		autoClose: 4000,
	};
	useEffect(() => {
		setCurrentAvatar(session?.user.avatar);
	}, [user]);

	const changeAvatar = async () => {
		let image = await axios.get(
			`https://api.multiavatar.com/${Math.round(Math.random() * 1000)}`
		);
		//to store img temporally
		const buffer = new Buffer(image.data);
		const data = buffer.toString("base64");
		setCurrentAvatar(data);
	};

	const pageRefresh = () => {
		router.push("/chats");
	};

	const onSubmit = async (data) => {
		const result = await axios.post(`api/profile/${user._id}`, {
			username: data.username,
			avatar: currentAvatar,
		});

		if (result.status == 200) {
			router.push("/chats");
			toast.success("Saved successfully", toastOptions);
		} else {
			toast.error("Failed to save", toastOptions);
		}
	};
	return (
		<div className="w-full   flex justify-center items-center bg-[#131324] h-[92vh] ">
			<div className="w-[70vw] h-[65vh] flex justify-center items-center shadow-md bg-[#6a6ab9] shadow-[#d8ecfc]  rounded-2xl max-sm:flex-col max-sm:w-[80vw] max-sm:h-[80vh]">
				{/* first block  */}
				<div className="w-[50%] h-[60vh] flex flex-col justify-center pt-4 items-center gap-8 max-sm:w-full">
					<div className="text-xl font-bold text-[#d8ecfc] max-sm:block hidden ">
						<h3>Edit Your Profile</h3>
					</div>
					<div>
						<img
							src={`data:image/svg+xml;base64,${currentAvatar}`}
							className="w-[25vh] rounded-full shadow-lg shadow-slate-800 border-[8px] border-[#d8ecfc] border-opacity-70 max-sm:w-[25vw] max-sm:border-4"
						/>
					</div>
					{/* new avatar  */}
					<div className="flex gap-6">
						<div className="bg-[#131324] py-2 px-4 rounded-md max-sm:py-1 max-sm:px-2 flex justify-center items-center">
							<TbRefresh
								onClick={changeAvatar}
								className="text-slate-200 font-semibold text-xl cursor-pointer"
							/>
						</div>
						{/*reversing change  */}
						<div className="bg-[#131324] py-2 px-4 rounded-md max-sm:py-1 max-sm:px-2 flex justify-center items-center">
							<GrRevert
								onClick={() => {
									pageRefresh();
								}}
								className="text-slate-200 font-semibold text-xl cursor-pointer"
							/>
						</div>
					</div>
				</div>

				{/* second block  */}
				<div className="w-[50%] h-[60vh]  flex justify-center bg-[#6a6ab9] items-start flex-col gap-8 pl-8 max-sm:w-[80vw] max-sm:items-center max-sm:p-0 max-sm:gap-6">
					{/* 1 heading */}
					<div className="text-2xl font-bold text-[#d8ecfc] max-sm:hidden ">
						<h3>Edit Your Profile</h3>
					</div>

					{/*2nd email  */}
					<div className="flex justify-start items-center  gap-3 w-full max-sm:justify-center">
						<h3 className=" p-3 w-[50%] h-[5vh] outline-dashed justify-start flex items-center line-through max-sm:w-[60%]">
							{user?.email}
						</h3>
						<MdEmail className="text-lg" />
					</div>

					{/* 3rd form */}
					<form
						className="flex flex-col gap-8 w-full justify-center items-start max-sm:items-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* username  */}
						<div className="flex gap-1 w-full flex-col">
							<div className="flex items-center gap-3 w-full max-sm:justify-center ">
								<input
									defaultValue={user?.username}
									{...register("username", {
										required: "Username is required",
										validate: (value) => {
											if (value.length < 3) {
												return "Username must be atleast 3 characters ";
											}
										},
									})}
									type="text"
									placeholder="Enter username"
									className=" p-3 w-[50%] h-[5vh] bg-transparent outline-dashed max-sm:w-[60%]"
								></input>
								<FaUser className="text-lg" />
							</div>
							{errors.username && (
								<p className="text-red-600">{errors.username.message}</p>
							)}
						</div>

						{/*todo joined-at */}

						<p className="text-[#131324] text-md font-semibold">
							<span className="text-[#d8ecfc] text-md font-bold">
								JoinedAt:
							</span>
							{"  "}
							{time}
						</p>
						<button
							type="submit"
							className="py-2 px-8 bg-[#131324] text-[#d8ecfc] text-lg font-semibold rounded-lg max-sm:px-4 max-sm:py-1 max-sm:text-md"
						>
							Save Changes
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
