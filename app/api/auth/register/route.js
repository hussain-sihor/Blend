import User from "@/models/User";
import { connectDB } from "@/mongodb";
import { hash } from "bcryptjs";

export const POST = async (req, res) => {
	try {
		await connectDB();
		const { username, email, password } = await req.json();
		// console.log(username);
		const userExists = await User.findOne({ email });
		if (userExists) {
			return new Response("User already exists", { status: 400 });
		}
		const hashedPassword = await hash(password, 10);
		//creating new user (chats[],profile) will be saved after
		const newUser = await User.create({
			username,
			email,
			password: hashedPassword,
		});
		await newUser.save();
		return new Response(JSON.stringify(newUser), { status: 201 });
	} catch (error) {
		console.log(error);
		return new Response("Failed to create new user", { status: 500 });
	}
};
