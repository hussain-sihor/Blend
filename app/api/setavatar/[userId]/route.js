import User from "@/models/User";

export const POST = async (req, { params }) => {
	try {
		const { userId } = params;
		const { avatar } = await req.json();
		const updatedUser = await User.findByIdAndUpdate(userId, {
			avatar,
		});
		return new Response(JSON.stringify(updatedUser), { status: 200 });
	} catch (error) {
		return new Response("Failed to set avatar", { status: 500 });
	}
};
