import type { Metadata } from "next";
import MuraiShippingReturnPolicyPage from "@/components/home-murai/MuraiShippingReturnPolicyPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/shipping-policy");

export default function ShippingPolicyPage() {
  return <MuraiShippingReturnPolicyPage />;
}
