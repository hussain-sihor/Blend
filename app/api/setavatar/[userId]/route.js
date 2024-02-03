//api/setavatar/userId
// for setting an avatar of currentUser
import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const POST = async (req, { params }) => {
	try {
		const { userId } = params;
		const { avatar } = await req.json();
		await connectDB();
		const updatedUser = await User.findByIdAndUpdate(userId, {
			avatar,
		});
		return new Response(JSON.stringify(updatedUser), { status: 200 });
	} catch (error) {
		return new Response("Failed to set avatar", { status: 500 });
	}
};
