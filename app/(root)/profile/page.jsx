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

const ProfilePage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const user = session?.user;
	const [currentAvatar, setCurrentAvatar] = useState();
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
		<div className="w-full   flex justify-center items-center bg-black h-screen">
			<div className="w-[70vw] h-[65vh] flex justify-center items-center shadow-lg bg-slate-200 shadow-slate-700 rounded-2xl">
				{/* first block  */}
				<div className="w-[50%] h-[60vh]  flex flex-col justify-center pt-4 items-center gap-8 ">
					<div>
						<img
							src={`data:image/svg+xml;base64,${currentAvatar}`}
							className="w-[25vh] rounded-full shadow-lg shadow-slate-800"
						/>
					</div>
					{/* new avatar  */}
					<div className="flex gap-6">
						<div className="bg-[#131324] py-2 px-4 rounded-md">
							<TbRefresh
								onClick={changeAvatar}
								className="text-slate-200 font-semibold text-xl cursor-pointer"
							/>
						</div>
						{/*reversing change  */}
						<div className="bg-[#131324] py-2 px-4 rounded-md">
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
				<div className="w-[50%] h-[60vh]  flex justify-center bg-purple-200 items-start flex-col gap-8 pl-8">
					{/* 1 heading */}
					<div className="text-xl font-bold">
						<h3>Edit your Profile</h3>
					</div>

					{/*2nd email  */}
					<div className="flex justify-start items-center  gap-3 w-full ">
						<h3 className=" p-3 w-[50%] h-[5vh] opacity-60 bg-slate-300 outline-dashed justify-start flex items-center ">
							{user?.email}
						</h3>
						<MdEmail className="text-lg" />
					</div>

					{/* 3rd form */}
					<form
						className="flex flex-col gap-8 w-full  justify-center items-start"
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* username  */}
						<div className="flex gap-1 w-full flex-col">
							<div className="flex items-center gap-3 w-full ">
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
									className=" p-3 w-[50%] h-[5vh] bg-transparent outline-dashed"
								></input>
								<FaUser className="text-lg" />
							</div>
							{errors.username && (
								<p className="text-red-600">{errors.username.message}</p>
							)}
						</div>

						{/*todo joined-at */}

						<button
							type="submit"
							className="py-2 px-8 bg-[#131324] text-slate-200 text-lg font-semibold rounded-lg"
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
