import { propertyCopy } from "@/lib/i18n/property-copy";
import {
  isListLikeDescription,
  splitDescriptionParagraphs,
} from "@/lib/properties/description-paragraphs";

type PropertyDescriptionProps = {
  description: string;
};

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  const blocks = splitDescriptionParagraphs(description);
  if (blocks.length === 0) {
    return null;
  }

  const [lead, ...rest] = blocks;
  const listLike = isListLikeDescription(blocks);

  return (
    <>
      <h2 className="sr-only">{propertyCopy.descriptionAccessibleTitle}</h2>
      {rest.length === 0 ? (
        <p className="max-w-3xl font-display text-2xl leading-[1.35] text-balance text-foreground sm:text-3xl">
          {lead}
        </p>
      ) : listLike ? (
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-12">
          <p className="font-display text-2xl leading-[1.35] text-balance text-foreground sm:text-3xl lg:col-span-5">
            {lead}
          </p>
          <ul
            className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:border-l lg:border-line lg:pl-10 xl:pl-12"
            aria-label={propertyCopy.descriptionDetailsLabel}
          >
            {rest.map((item) => (
              <li key={item} className="text-muted leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-12">
          <p className="font-display text-2xl leading-[1.35] text-balance text-foreground sm:text-3xl lg:col-span-5">
            {lead}
          </p>
          <div className="prose-editorial max-w-none lg:col-span-7 lg:border-l lg:border-line lg:pl-10 xl:pl-12">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
