// Admin login page should not have Navbar/Footer
export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}



