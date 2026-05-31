"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "dev";

/** 詳細グラレコ (1024)。PNG 不在時は説明メッセージにフォールバック。 */
export function DetailGrarec({
  name,
  notGeneratedLabel,
}: {
  name: string;
  notGeneratedLabel: string;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="w-full aspect-square rounded-md border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
        <ImageIcon className="h-8 w-8 opacity-50" />
        <p>{notGeneratedLabel}</p>
      </div>
    );
  }
  return (
    <Image
      src={`/images/cc-grarec-detail/${name}.png?v=${BUILD_ID}`}
      alt={`/${name} detail graphic recording`}
      width={1024}
      height={1024}
      unoptimized
      className="w-full h-auto rounded-md border border-border bg-white"
      onError={() => setErrored(true)}
    />
  );
}
