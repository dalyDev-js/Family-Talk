import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>FamTalk</p>
        </Link>
        <ul>
          <Link href="#events">Home</Link>
          <Link href="#about">Events</Link>
          <Link href="#contact">Create</Link>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
