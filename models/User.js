import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		//will be provide after login
		avatar: {
			type: String,
			default: "",
		},
		// chats consist of array of individual (Chat) model
		chats: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
			default: [],
		},
	},
	{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
