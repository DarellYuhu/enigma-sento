import { getLayoutById } from "@/api/layout/fetch";
import VanillaCanvas from "../../components/vanilla-canvas";

export default async function Page({
  params,
}: {
  params: Promise<{ layoutId: string }>;
}) {
  const { layoutId } = await params;
  const { data } = await getLayoutById(layoutId);

  return (
    <div>
      {data && <VanillaCanvas value={data} mode={"EDITOR"} name={data.name} />}
    </div>
  );
}
