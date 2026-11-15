import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  PolicyLayout,
  PolicyHeading2,
  PolicyHeading3,
  PolicyDiamondList,
  PolicyNoteCallout,
  PolicyAddressBlock,
} from '@/components/PolicyLayout';
import {
  SHIPPING_POLICY,
  RETURNS_POLICY,
  CANCELLATION_POLICY,
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
  STORE_CONTACT,
} from '@/data/pages';

/* =====================================================================
   1. SHIPPING & DELIVERY POLICY
   ===================================================================== */
export function ShippingPolicyPage() {
  const p = SHIPPING_POLICY;
  return (
    <>
      <Helmet>
        <title>Shipping &amp; Delivery Policy | Varcham India</title>
        <meta
          name="description"
          content="Learn about Varcham India's shipping timelines, Kolkata same-day delivery, free shipping thresholds, and fragile packaging guarantee."
        />
        <link rel="canonical" href="https://varcham.in/policies/shipping" />
        <meta property="og:title" content="Shipping & Delivery Policy | Varcham India" />
        <meta
          property="og:description"
          content="Same-day delivery across Kolkata, 3–6 days pan-India shipping, and store pickup in 2 hours."
        />
        <meta property="og:url" content="https://varcham.in/policies/shipping" />
      </Helmet>

      <PolicyLayout
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subline={p.hero.subline}
        lastUpdated={p.lastUpdated}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shipping Policy' },
        ]}
      >
        <p className="text-espresso leading-relaxed">{p.intro}</p>

        <PolicyHeading2>Delivery time</PolicyHeading2>
        <PolicyDiamondList items={p.deliveryTimeBullets} />

        <PolicyNoteCallout>{p.timingNote}</PolicyNoteCallout>

        <PolicyHeading2>Shipping charges</PolicyHeading2>
        <div className="overflow-x-auto my-5">
          <table className="w-full text-left text-sm border border-hairline rounded-sm overflow-hidden">
            <thead className="bg-parchment font-cinzel text-xs uppercase tracking-[0.1em] text-walnut border-b border-hairline">
              <tr>
                <th className="p-3.5">Fulfilment Method</th>
                <th className="p-3.5">Shipping Fee</th>
                <th className="p-3.5">Threshold / Condition</th>
                <th className="p-3.5">Delivery ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-white">
              {p.charges.map((row, idx) => (
                <tr key={idx} className="hover:bg-parchment/40 transition-colors">
                  <td className="p-3.5 font-medium text-espresso">{row.method}</td>
                  <td className="p-3.5 font-semibold text-tulsi">{row.fee}</td>
                  <td className="p-3.5 text-walnut">{row.condition}</td>
                  <td className="p-3.5 text-walnut">{row.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PolicyHeading2>{p.fragileHeading}</PolicyHeading2>
        <p className="text-espresso leading-relaxed">{p.fragileText}</p>

        <PolicyHeading2>{p.uncontrollableHeading}</PolicyHeading2>
        <p className="text-espresso leading-relaxed">{p.uncontrollableText}</p>
      </PolicyLayout>
    </>
  );
}

/* =====================================================================
   2. RETURNS, EXCHANGE & REFUND POLICY
   ===================================================================== */
export function ReturnsPolicyPage() {
  const p = RETURNS_POLICY;
  return (
    <>
      <Helmet>
        <title>Returns, Exchange &amp; Refund Policy | Varcham India</title>
        <meta
          name="description"
          content="Clear returns and refund policy for Varcham India. 5-day damage replacement guarantee and sacred consumables guidelines."
        />
        <link rel="canonical" href="https://varcham.in/policies/returns" />
        <meta property="og:title" content="Returns & Refund Policy | Varcham India" />
        <meta
          property="og:description"
          content="5-day damage reporting, sacred consumables note, reverse pickup, and full refund processing."
        />
        <meta property="og:url" content="https://varcham.in/policies/returns" />
      </Helmet>

      <PolicyLayout
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subline={p.hero.subline}
        lastUpdated={p.lastUpdated}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Returns & Refund Policy' },
        ]}
      >
        <p className="text-espresso leading-relaxed">{p.intro}</p>

        <PolicyNoteCallout>{p.sanctityNote}</PolicyNoteCallout>

        <PolicyHeading2>{p.cannotAcceptHeading}</PolicyHeading2>
        <PolicyDiamondList items={p.cannotAcceptBullets} />

        <PolicyHeading2>{p.partialReturnsHeading}</PolicyHeading2>
        <p className="text-espresso leading-relaxed">{p.partialReturnsText}</p>

        <PolicyHeading2>{p.reversePickupHeading}</PolicyHeading2>
        <p className="text-espresso leading-relaxed">{p.reversePickupText}</p>

        <PolicyHeading2>{p.selfShipHeading}</PolicyHeading2>
        <p className="text-espresso leading-relaxed">{p.selfShipText}</p>
        <PolicyAddressBlock />
        <p className="text-xs text-walnut mt-1">
          Please retain your courier booking receipt and tracking number until the return package is acknowledged by our store desk.
        </p>

        <PolicyHeading2>{p.refundsHeading}</PolicyHeading2>
        <PolicyDiamondList items={p.refundsBullets} />
      </PolicyLayout>
    </>
  );
}

/* =====================================================================
   3. CANCELLATION POLICY
   ===================================================================== */
export function CancellationPolicyPage() {
  const p = CANCELLATION_POLICY;
  return (
    <>
      <Helmet>
        <title>Cancellation Policy | Varcham India</title>
        <meta
          name="description"
          content="Cancel your order before packing or within 30 minutes for Kolkata same-day delivery. Learn our simple cancellation rules."
        />
        <link rel="canonical" href="https://varcham.in/policies/cancellation" />
        <meta property="og:title" content="Cancellation Policy | Varcham India" />
        <meta
          property="og:description"
          content="Hassle-free cancellation before dispatch and quick 5–7 day refund turnaround."
        />
        <meta property="og:url" content="https://varcham.in/policies/cancellation" />
      </Helmet>

      <PolicyLayout
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subline={p.hero.subline}
        lastUpdated={p.lastUpdated}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cancellation Policy' },
        ]}
      >
        <p className="text-espresso leading-relaxed">{p.intro}</p>

        <PolicyHeading2>Order cancellation terms</PolicyHeading2>
        <PolicyDiamondList items={p.bullets} />
      </PolicyLayout>
    </>
  );
}

/* =====================================================================
   4. PRIVACY POLICY
   ===================================================================== */
export function PrivacyPolicyPage() {
  const p = PRIVACY_POLICY;
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Varcham India</title>
        <meta
          name="description"
          content="Plain-language privacy policy from Varcham India detailing DPDP Act 2023 compliance, data retention, and Razorpay payment security."
        />
        <link rel="canonical" href="https://varcham.in/policies/privacy" />
        <meta property="og:title" content="Privacy Policy | Varcham India" />
        <meta
          property="og:description"
          content="How Varcham India safeguards customer data, respects consent, and adheres to the DPDP Act 2023."
        />
        <meta property="og:url" content="https://varcham.in/policies/privacy" />
      </Helmet>

      <PolicyLayout
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subline={p.hero.subline}
        lastUpdated={p.lastUpdated}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
      >
        <p className="text-espresso leading-relaxed">{p.intro}</p>

        {p.sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <PolicyHeading2>{section.title}</PolicyHeading2>
            <PolicyDiamondList items={section.bullets} />
          </div>
        ))}

        <div className="pt-2">
          <PolicyHeading3>Grievance Officer Contact Details</PolicyHeading3>
          <PolicyAddressBlock />
        </div>
      </PolicyLayout>
    </>
  );
}

/* =====================================================================
   5. TERMS OF SERVICE
   ===================================================================== */
export function TermsPolicyPage() {
  const p = TERMS_OF_SERVICE;
  return (
    <>
      <Helmet>
        <title>Terms of Service | Varcham India</title>
        <meta
          name="description"
          content="Terms of service, pricing, natural craft variations, and governing law for Varcham India (varcham.in)."
        />
        <link rel="canonical" href="https://varcham.in/policies/terms" />
        <meta property="og:title" content="Terms of Service | Varcham India" />
        <meta
          property="og:description"
          content="Terms governing purchases, artisanal craft variations, Razorpay payments, and Kolkata court jurisdiction."
        />
        <meta property="og:url" content="https://varcham.in/policies/terms" />
      </Helmet>

      <PolicyLayout
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subline={p.hero.subline}
        lastUpdated={p.lastUpdated}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service' },
        ]}
      >
        <p className="text-espresso leading-relaxed">{p.intro}</p>

        {p.sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <PolicyHeading2>{section.title}</PolicyHeading2>
            <PolicyDiamondList items={section.bullets} />
          </div>
        ))}

        <PolicyNoteCallout>
          For our comprehensive guidelines on dispatch, returns, and damages, please visit our{' '}
          <Link to="/policies/shipping" className="text-tulsi underline font-semibold">
            Shipping Policy
          </Link>{' '}
          and{' '}
          <Link to="/policies/returns" className="text-tulsi underline font-semibold">
            Returns &amp; Refund Policy
          </Link>
          .
        </PolicyNoteCallout>

        <div className="pt-2">
          <PolicyHeading3>Store Office</PolicyHeading3>
          <PolicyAddressBlock />
        </div>
      </PolicyLayout>
    </>
  );
}

/* =====================================================================
   DYNAMIC POLICY SLUG ROUTER
   ===================================================================== */
export function PolicySlugRouter() {
  const { slug } = useParams<{ slug: string }>();

  switch (slug) {
    case 'shipping':
      return <ShippingPolicyPage />;
    case 'returns':
      return <ReturnsPolicyPage />;
    case 'cancellation':
      return <CancellationPolicyPage />;
    case 'privacy':
      return <PrivacyPolicyPage />;
    case 'terms':
      return <TermsPolicyPage />;
    default:
      return <ShippingPolicyPage />;
  }
}
