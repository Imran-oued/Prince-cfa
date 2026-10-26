import { redirect } from "next/navigation";

export default function ConfidentialiteRedirect() {
  redirect("/politique-de-confidentialite");
}
