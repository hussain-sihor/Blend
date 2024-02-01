"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { PiSignOutBold } from "react-icons/pi";

const Navbar = () => {
	const { data: session } = useSession();
	const user = session?.user;
	const [avatar, setAvatar] = useState();

	useEffect(() => {
		setAvatar(user?.avatar);
	}, [user]);

	const handelLogout = async () => {
		signOut({ callbackUrl: "/" });
	};
	return (
		<div className="flex justify-between items-center bg-[#4e0eff] text-[#131324] h-[7vh] w-full py-7 px-7">
			<div className="flex justify-center items-center gap-2">
				<img src="/assets/messenger.png" alt="logo" className="w-[6vh]" />
				<h3 className="text-xl font-Righteous font-bold">Blend</h3>
			</div>
			<div className="flex justify-center items-center gap-7">
				<div className="">
					<Link href={"/profile"}>
						<img
							src={`data:image/svg+xml;base64,${avatar}`}
							className="w-[6vh]"
						/>
					</Link>
				</div>
				<div>
					<PiSignOutBold
						onClick={handelLogout}
						className="text-2xl font-bold cursor-pointer"
					/>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
