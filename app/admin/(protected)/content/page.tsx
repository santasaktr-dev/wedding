import { getDraftContentForAdmin } from "../../../../lib/cms/actions";
import { SectionEditor } from "../../components/SectionEditor";

export default async function ContentPage() {
  const content = await getDraftContentForAdmin();

  return <SectionEditor initialContent={content} />;
}
