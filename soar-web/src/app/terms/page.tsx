import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Page() {
  return (
    <LegalPage title="Terms of Service" updated="June 2026">
      <p>
        These Terms govern your use of the SOAR website and your purchase of our products. By accessing the site you agree
        to these Terms and to our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least <strong>13 years old</strong> to use this site. To place an order you must be the age of
        majority in your region, or have the consent of a parent or guardian, and provide accurate account and payment
        information.
      </p>

      <h2>Products, drops &amp; pricing</h2>
      <p>
        Collections release in limited, numbered drops and may sell out. Colours and details may vary slightly between
        screens and finished garments. Prices and availability can change at any time. We may limit quantities or refuse or
        cancel an order at our discretion.
      </p>

      <h2>Orders &amp; payment</h2>
      <p>
        An order is an offer to buy; acceptance occurs when we confirm and ship. If we cannot fulfil an order we will
        notify you and issue any required refund.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The SOAR name, the box-and-bird breakthrough symbol, designs, graphics, text, and all site content are owned by
        SOAR and protected by law. You may not copy, reproduce, or use them without our written permission.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not misuse the site, attempt to disrupt it, infringe others&apos; rights, or use it for unlawful purposes.
      </p>

      <h2>Disclaimers &amp; liability</h2>
      <p>
        The site and products are provided &quot;as is&quot; to the fullest extent permitted by law. To the extent
        permitted by law, SOAR is not liable for indirect or consequential damages arising from your use of the site.
      </p>

      <h2>Governing law</h2>
      <p>These Terms are governed by the laws of the Province of Ontario, Canada, without regard to conflict-of-law rules.</p>

      <h2>Changes &amp; contact</h2>
      <p>
        We may update these Terms; the date above reflects the latest version. Questions?{" "}
        <a href="mailto:soarnextlevel@gmail.com">soarnextlevel@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
