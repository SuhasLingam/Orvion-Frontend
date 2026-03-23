import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#E5E7EB] pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Logo and Description */}
          <div className="flex flex-col pr-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image src="/logo.svg" alt="Orvion Logo" fill className="object-contain" />
              </div>
              <span className="text-[22px] font-heading font-medium tracking-widest text-[#B58543] uppercase">
                Orvion
              </span>
            </div>
            <p className="text-[#374151] text-[15px] leading-relaxed font-medium">
              Empowering the next generation of tech professionals with world-class education and career opportunities.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-[18px] font-bold text-[#111827] mb-6 font-heading">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/about" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">About us</Link></li>
              <li><Link href="/#programs" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">Programs</Link></li>
              <li><Link href="/#internships" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">Internship Tracks</Link></li>
              <li><Link href="/contact" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Programs */}
          <div className="flex flex-col">
            <h4 className="text-[18px] font-bold text-[#111827] mb-6 font-heading">
              Popular Programs
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/programs/devops-cloud" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">Cloud &amp; DevOps</Link></li>
              <li><Link href="/programs/ai-data-science" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">AI &amp; Machine Learning</Link></li>
              <li><Link href="/programs/cybersecurity" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">Cybersecurity</Link></li>
              <li><Link href="/programs/ui-ux-design" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">UI/UX Design</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col">
            <h4 className="text-[18px] font-bold text-[#111827] mb-6 font-heading">
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="mailto:hello@orvion.in" className="text-[15px] font-semibold text-[#4B5563] hover:text-[#B58543] transition-colors">
                  hello@orvion.in
                </a>
              </li>
              <li className="text-[15px] font-semibold text-[#4B5563]">
                +91 98765 43210
              </li>
              <li className="text-[15px] font-semibold text-[#4B5563] leading-relaxed">
                Bengaluru, Karnataka,<br />
                India
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="w-full flex justify-center items-center pt-8 border-t border-[#E5E7EB]">
          <p className="text-[14px] font-semibold text-[#4B5563]">
            © {new Date().getFullYear()} Orvion. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
