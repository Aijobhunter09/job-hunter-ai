import { navigate } from '@/lib/router';

const sections = [
  {
    title: 'Product',
    links: [
      { label: 'Jobs', path: '/jobs' },
      { label: 'Resume', path: '/resume' },
      { label: 'Applications', path: '/applications' },
      { label: 'Interview Prep', path: '/interview' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/' },
      { label: 'Contact', path: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', path: '/' },
      { label: 'Terms', path: '/' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white font-bold text-sm">
                AI
              </div>
              <span className="text-lg font-bold text-slate-900">Job Hunter</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Find better jobs. Apply smarter.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-slate-500 hover:text-primary-700 transition"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 py-6">
          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()} AI Job Hunter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
