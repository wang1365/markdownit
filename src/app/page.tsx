import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { detectLocaleFromHeader } from "@/i18n/config";

export default async function HomePage() {
  const headersList = await headers();
  const locale = detectLocaleFromHeader(headersList.get("accept-language"));
  redirect(`/${locale}`);
}
