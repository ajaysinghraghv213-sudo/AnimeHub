import Navbar from "../Components/Navbar";



export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
        <Navbar />
            {children}
        </>
    );
}
