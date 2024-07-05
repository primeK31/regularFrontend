export default function Foots() {
  return (
    <footer className="fixed bottom-0 w-full bg-blue-500 text-white py-12">
    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:gap-0">
      <p className="text-sm">© 2024 Quiz Generator. All rights reserved.</p>
      <div className="flex gap-4">
        <a className="hover:text-muted-foreground/80 transition-colors" href="#">
          Privacy Policy
        </a>
        <a className="hover:text-muted-foreground/80 transition-colors" href="#">
          Terms of Service
        </a>
        <a className="hover:text-muted-foreground/80 transition-colors" href="#">
          Contact Us
        </a>
      </div>
    </div>
  </footer>
  )
}