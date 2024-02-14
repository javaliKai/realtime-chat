import { Footer } from 'flowbite-react';

export default function FooterLayout() {
  return (
    <Footer container bgDark>
      <div className='w-full text-center'>
        <div className='w-full justify-between sm:flex sm:items-center sm:justify-between'>
          {/* <Footer.Brand
            color='blue'
            href='#'
            src='chat_icon.svg'
            alt='Liaoliao Logo'
            name='Liaoliao'
          /> */}
          <Footer.LinkGroup>
            <Footer.Link href='#'>About</Footer.Link>
            <Footer.Link href='#'>Privacy Policy</Footer.Link>
            <Footer.Link href='#'>Licensing</Footer.Link>
            <Footer.Link href='#'>Contact</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href='#' by='Liaoliao™' year={2024} />
      </div>
    </Footer>
  );
}
