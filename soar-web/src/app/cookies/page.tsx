import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function Page() {
  return (
    <LegalPage title="Cookie Policy" updated="June 2026">
      <p>
        Cookies and similar technologies (local and session storage) are small pieces of data stored in your browser. This
        policy explains how SOAR uses them. For more on how we handle data, see our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>How we use them</h2>
      <ul>
        <li><strong>Essential</strong> — remember that you have entered the site and keep core features working.</li>
        <li><strong>Preferences</strong> — remember choices such as your bag contents during a visit.</li>
        <li><strong>Analytics</strong> — where enabled, help us understand how the site is used so we can improve it.</li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings. Blocking essential cookies may stop parts of the
        site from working.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about cookies? Email <a href="mailto:soarnextlevel@gmail.com">soarnextlevel@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
