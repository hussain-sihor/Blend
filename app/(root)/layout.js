import Provider from "@/components/Provider";
import "../globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
	title: "Blend-chat",
	description: "A Next.js project",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Provider>
					<Navbar />
					{children}
				</Provider>
			</body>
		</html>
	);
}
