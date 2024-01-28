import Provider from "@/components/Provider";
import "../globals.css";

export const metadata = {
	title: "Blend-chat",
	description: "A Next.js project",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
