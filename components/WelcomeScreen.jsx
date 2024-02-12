import React from "react";

const WelcomeScreen = () => {
	return (
		<div className="w-[70vw] h-[92vh] flex justify-center items-center bg-[#131324] max-sm:hidden ">
			<div className="text-3xl font-bold text-slate-200">
				<p className="mb-2">
					Welcome to <span className="text-[#b7b7f1]">Blend</span> ! 🎉
				</p>
				<p>We're thrilled to have you on board.</p>
			</div>
		</div>
	);
};

export default WelcomeScreen;
