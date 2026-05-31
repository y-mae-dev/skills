import { Badge } from "@/components/ui/badge";
import { parseTags, tagColor } from "@/lib/tags";

/** tags 文字列を色付きバッジ列で描画する。既知タグのみ配色し、他は灰色。 */
export function SkillTags({ tags }: { tags: string }) {
  const list = parseTags(tags);
  if (list.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className={`text-xs font-normal ${tagColor(tag)}`}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
