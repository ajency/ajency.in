import { SiteFooter } from 'ajency-design';

export const HomeFooter = () => (
  <SiteFooter
    columns={[
      [
        { href: 'mailto:talktous@ajency.in', label: 'talktous@ajency.in' },
        { href: 'https://wa.me/+919975931402', label: '+91 99759 31402', external: true },
      ],
      [{ label: 'Panjim, Goa, India', muted: true }],
      [{ href: 'https://www.linkedin.com/in/anujkhurana/', label: 'LinkedIn', external: true }],
    ]}
    copyright="© 2026 Ajency.in · Digital Dwarves Pvt Ltd"
  />
);
