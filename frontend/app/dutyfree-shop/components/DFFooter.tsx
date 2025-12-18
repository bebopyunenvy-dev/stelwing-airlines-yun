import { Plane } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function DFFooter() {
  return (
    <footer className="bg-[var(--df-primary-dark)] text-[var(--df-text-light)]">
      <div className="mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold mb-4">Get started</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Private jet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Register
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Current Jet Deals
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold mb-4">Get started</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Private jet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Register
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Current Jet Deals
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold mb-4">Get started</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Private jet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Register
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-[var(--df-accent-gold)] transition-colors"
                >
                  Current Jet Deals
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-white/80 mb-4">
              Fynest was founded in 1991 by a group of safety-focused
              professionals who created The Wyvern Standard for rigorously
              vetting air charter operators.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter Email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white whitespace-nowrap">
                <Plane className="w-4 h-4 mr-2" />
                加入我們
              </Button>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">EUROPE</h4>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Europe 45 Gloucester Road</li>
                <li>London DT1M 3BF</li>
                <li>+44 (0)20 3671 5709</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">EUROPE</h4>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Europe 45 Gloucester Road</li>
                <li>London DT1M 3BF</li>
                <li>+44 (0)20 3671 5709</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Brand Info */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="var(--df-accent-gold)"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="var(--df-accent-gold)"
                  strokeWidth="2"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="var(--df-accent-gold)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold">STELWING</span>
          </div>
          <p className="text-sm text-white/60 max-w-2xl">
            Fynest was founded in 1991 by a group of safety-focused
            professionals who created The Wyvern Standard for rigorously vetting
            all charter operators.
          </p>
        </div>
      </div>
    </footer>
  );
}
