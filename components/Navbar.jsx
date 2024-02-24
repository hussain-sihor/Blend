"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { PiSignOutBold } from "react-icons/pi";

const Navbar = () => {
	const { data: session } = useSession();
	const user = session?.user;
	const photo = user?.avatar;
	const [avatar, setAvatar] = useState();

	useEffect(() => {
		setAvatar(photo);
	}, [photo]);

	const handelLogout = async () => {
		signOut({ callbackUrl: "/" });
	};
	return (
		<div className="flex justify-between items-center bg-[#6a6ab9] text-[#131324] h-[8vh] w-full py-7 px-7 max-sm:px-3  ">
			{/* Logo  */}
			<div className="flex justify-center items-center gap-2">
				<img src="/assets/messenger.png" alt="logo" className="w-[6vh]" />
				<h3 className="text-xl font-Protest-Guerrilla font-bold text-[#dce6ee]">
					Blend
				</h3>
			</div>
			{/* profile signOut  */}
			<div className="flex justify-center items-center gap-7 max-sm:gap-3">
				<div className="">
					<Link href={"/profile"}>
						<img
							src={`data:image/svg+xml;base64,${avatar}`}
							className="w-[3vw] rounded-full h-[3vw] flex justify-center items-center max-sm:w-[8vw] max-sm:h-[8vw]"
						/>
					</Link>
				</div>
				<div>
					<PiSignOutBold
						onClick={handelLogout}
						className="text-2xl font-bold cursor-pointer max-sm:text-xl"
					/>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
