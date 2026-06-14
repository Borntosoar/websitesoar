import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        This Privacy Policy explains how SOAR (&quot;SOAR&quot;, &quot;we&quot;, &quot;us&quot;) collects, uses, and
        protects your information when you visit our website or buy our products. By using the site you agree to this
        policy.
      </p>

      <h2>Information we collect</h2>
      <p>
        Information you give us — such as your email address, name, shipping and contact details, and order information.
        Order and payment details are processed by our commerce and payment providers. We also collect limited technical
        data (device, browser, pages viewed) through cookies and similar technologies.
      </p>

      <h2>How we use your information</h2>
      <p>
        To process and ship orders, provide customer support, send drop updates and marketing you have opted into, prevent
        fraud and abuse, and improve our products and the site.
      </p>

      <h2>How we share it</h2>
      <p>
        We do <strong>not</strong> sell your personal information. We share it only with service providers who help us
        operate — for example commerce hosting, payment processing, shipping carriers, and email/SMS delivery — and where
        required by law.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies and similar storage to run the site (such as remembering that you have entered it) and,
        where enabled, basic analytics. See our <Link href="/cookies">Cookie Policy</Link> for details.
      </p>

      <h2>Children&apos;s privacy &amp; age</h2>
      <p>
        You must be at least <strong>13 years old</strong> to use this site. We do not knowingly collect personal
        information from children under 13. If you believe a child under 13 has provided us information, contact us and we
        will delete it. Purchases require you to be the age of majority in your region, or to have permission from a parent
        or guardian.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request access to, correction of, or deletion of your personal information, and you can unsubscribe from
        marketing at any time via the link in any message or by contacting us.
      </p>

      <h2>Data retention &amp; security</h2>
      <p>
        We keep your information only as long as needed for the purposes above or as required by law, and we use reasonable
        measures to protect it. No method of transmission is perfectly secure.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. Material changes will be reflected by the date above.</p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href="mailto:soarnextlevel@gmail.com">soarnextlevel@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
