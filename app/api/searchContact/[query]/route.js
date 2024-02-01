import User from "@/models/User";
import { connectDB } from "@/mongodb";

export const GET = async (req, { params }) => {
	try {
		await connectDB();

		const { query } = params;
		const searchedContacts = await User.find({
			username: { $regex: query, $options: "i" },
		});

		return new Response(JSON.stringify(searchedContacts), { status: 201 });
	} catch (error) {
		return new Response("Cant search", { status: 500 });
	}
};
