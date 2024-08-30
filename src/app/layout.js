import "./globals.css";

export const metadata = {
  title: "Gmover Game Test",
  description: "Gmover Farm Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
