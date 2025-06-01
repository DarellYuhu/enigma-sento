import { getLayoutById } from "@/api/layout/fetch";
import VanillaCanvas from "../components/vanilla-canvas";

export default async function LayoutDetailPage({
  params,
}: {
  params: Promise<{ layoutId: string }>;
}) {
  const { layoutId } = await params;
  const { data } = await getLayoutById(layoutId);

  console.log(data?.template.shapes);
  return <div>{data && <VanillaCanvas value={data} mode="CREATOR" />}</div>;
}
