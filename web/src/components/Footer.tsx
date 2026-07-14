export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>HealthEase</h2>

          <p>
            Your trusted online pharmacy.
            Fast, safe and reliable healthcare
            products delivered to your door.
          </p>
        </div>

        <div className="footer-links">

          <div>
            <h3>Company</h3>

            <a href="/">Home</a>

            <a href="/shop">
              Shop
            </a>

            <a href="/contact">
              Contact
            </a>

            <a href="/faq">
              FAQ
            </a>

          </div>

          <div>

            <h3>Account</h3>

            <a href="/account">
              Login
            </a>

            <a href="/checkout">
              Checkout
            </a>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        © 2026 HealthEase.
        All Rights Reserved.

      </div>

    </footer>
  )
}