import FooterLayout from '../ui/footer';
import Header from '../ui/header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className='min-h-[80vh] p-5'>{children}</div>
      <FooterLayout />
    </>
  );
}
