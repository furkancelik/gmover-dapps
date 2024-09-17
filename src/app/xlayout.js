import Layout from "@/components/Layout";

export const metadata = {
  title: "Gmover Game Test",
  description: "Gmover Farm Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
