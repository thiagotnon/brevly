import { useDeleteLink } from "@/app/hooks/use-delete-link";
import { DialogDelete } from "@/app/views/home/components/link-list/dialog-delete";
import { CopyButton } from "./copy-button";
import { ShortenedLink } from "./shortened-link";
import { VisitsCount } from "./visits-count";

type LinkListItemProps = {
  id: string;
  shortened: string;
  original: string;
  visits: number;
};
export function LinkListItem({
  visits,
  id,
  original,
  shortened,
}: LinkListItemProps) {
  const { isPending, handleDeleteLink, isToggle, setIsToggle } =
    useDeleteLink();

  return (
    <div className="flex justify-between items-center py-4 border-gray-200 border-b">
      <ShortenedLink original={original} shortened={shortened} />
      <div className="flex justify-center items-center gap-4">
        <VisitsCount visits={visits} />
        <div className="flex justify-center items-center gap-2">
          <DialogDelete
            id={id}
            onToggle={setIsToggle}
            open={isToggle}
            isPending={isPending}
            onDelete={handleDeleteLink}
          />
          <CopyButton shortened={shortened} />
        </div>
      </div>
    </div>
  );
}
