import type { Metadata } from "next";
import { Nav } from "@/app/components/Nav";
import { Footer } from "@/app/components/Footer";
import { SHIP } from "@/lib/policy";

export const metadata: Metadata = {
  title: "Shipping, Returns & Policies",
  description: "Shipping, returns, terms of service and privacy for SOAR — Collection One.",
  alternates: { canonical: "/policies" },
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-line py-12 md:py-16">
      <h2 className="display text-[clamp(1.8rem,4vw,2.8rem)]">{title}</h2>
      <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ash">{children}</div>
    </section>
  );
}

export default function PoliciesPage() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-24 md:pt-28">
        <div className="wrap py-12 md:py-16">
          <span className="mono text-ash">SOAR — Collection One</span>
          <h1 className="display mt-4 text-[clamp(2.4rem,6vw,5rem)]">Shipping, returns &amp; policies</h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-ash">
            The essentials. Anything else, email{" "}
            <a href="mailto:soarnextlevel@gmail.com" className="text-ink underline underline-offset-4">soarnextlevel@gmail.com</a>.
          </p>

          <Section id="shipping" title="Shipping & returns">
            <p>Every piece ships from Alberta, Canada. Orders are processed within {SHIP.processing}; you&rsquo;ll get a tracking link by email when yours is on the way. Complimentary standard shipping across Canada; international rates are shown at checkout.</p>
            <p>Returns are accepted within {SHIP.returnDays} days of delivery on unworn items with tags attached. Email us to start a return. Because Drop 001 is a numbered, limited edition, sizes can sell out before an exchange can be fulfilled — reach out early and we&rsquo;ll do our best.</p>
            <p>Not sure on sizing? Each product page has a fit note and size guide, or just ask us.</p>
          </Section>

          <Section id="terms" title="Terms of service">
            <p>By using this site and placing an order you agree to these terms. Prices are in CAD and may change without notice; we reserve the right to cancel or limit orders, including for limited-edition items. Checkout and payment are handled securely by Shopify.</p>
            <p>All SOAR names, marks, designs, and imagery are the property of SOAR and may not be used without permission. This site is provided &ldquo;as is&rdquo; without warranties; to the extent permitted by law, SOAR is not liable for indirect or incidental damages arising from its use.</p>
          </Section>

          <Section id="privacy" title="Privacy">
            <p>We collect only what we need to run the store and the First Flight list: your email (and phone, if you provide it), and order and delivery details. We use them to fulfil orders, provide support, and — only if you opt in — send drop announcements by email or SMS. You can unsubscribe at any time.</p>
            <p>We don&rsquo;t sell your personal information. Order and payment data is processed by Shopify; marketing contacts are stored with our email/SMS provider. To access or delete your data, email us.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
