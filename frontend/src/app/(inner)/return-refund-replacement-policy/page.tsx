import type { Metadata } from "next";
import MuraiReturnPolicyPage from "@/components/home-murai/MuraiReturnPolicyPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata(
  "/return-refund-replacement-policy",
);

export default function ReturnRefundReplacementPolicyPage() {
  return <MuraiReturnPolicyPage />;
}
