import { redirect } from "next/navigation";
export default function CategoryModePage({
 params,
}: {
 params: { slug: string };
}) {
 redirect(`/category/${params.slug}/guided`);
}