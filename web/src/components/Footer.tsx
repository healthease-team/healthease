import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="bg-mint pt-16 pb-8 mt-20 border-t border-brand-navy/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-extrabold text-brand-navy">
                Health<span className="text-accent-blue">Ease</span>
              </span>
            </div>
            <p className="text-text-muted">Your trusted online drugstore for every need.</p>
          </div>

          <div className="footer-links">
            <h6 className="font-bold uppercase text-sm tracking-wider mb-6 text-brand-navy">Quick Links</h6>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-text-muted hover:text-link-blue transition-colors">Shop</Link></li>
              <li><Link to="/essentials" className="text-text-muted hover:text-link-blue transition-colors">Essentials</Link></li>
              <li><Link to="/testimonials" className="text-text-muted hover:text-link-blue transition-colors">Testimonials</Link></li>
              <li><Link to="/faq" className="text-text-muted hover:text-link-blue transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-text-muted hover:text-link-blue transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h6 className="font-bold uppercase text-sm tracking-wider mb-6 text-brand-navy">Categories</h6>
            <ul className="space-y-3">
              <li><Link to="/shop" search={{ category: 'personal-care' }} className="text-text-muted hover:text-link-blue transition-colors">Personal Care</Link></li>
              <li><Link to="/shop" search={{ category: 'diabetic-care' }} className="text-text-muted hover:text-link-blue transition-colors">Diabetic Care</Link></li>
              <li><Link to="/shop" search={{ category: 'supplements' }} className="text-text-muted hover:text-link-blue transition-colors">Supplements</Link></li>
              <li><Link to="/shop" search={{ category: 'devices' }} className="text-text-muted hover:text-link-blue transition-colors">Devices</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h6 className="font-bold uppercase text-sm tracking-wider mb-6 text-brand-navy">Follow Us</h6>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl text-brand-navy hover:text-accent-blue transition-transform hover:-translate-y-1">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-2xl text-brand-navy hover:text-accent-blue transition-transform hover:-translate-y-1">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-2xl text-brand-navy hover:text-accent-blue transition-transform hover:-translate-y-1">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="text-2xl text-brand-navy hover:text-accent-blue transition-transform hover:-translate-y-1">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-navy/10 pt-8 mt-12 text-center text-text-muted">
          <p>&copy; {new Date().getFullYear()} HealthEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
