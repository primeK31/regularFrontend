import { Route, Routes } from 'react-router-dom';
import Home from './home';


function Heads() {

  return (
    <div>
    <header className="bg-blue-500 text-white">
<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
  <a className="flex items-center gap-2" href="#">
  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="h-6 w-6"
     />
    <span className="font-bold">Quiz Generator</span>
  </a>
  <nav className="hidden space-x-4 md:flex">
    <a className="hover:text-primary-foreground/80 transition-colors" href="#">
      Features
    </a>
    <a className="hover:text-primary-foreground/80 transition-colors" href="#">
      Pricing
    </a>
    <a className="hover:text-primary-foreground/80 transition-colors" href="#">
      Contact
    </a>
  </nav>
</div>
</header>
</div>
    )
}

export default Heads;