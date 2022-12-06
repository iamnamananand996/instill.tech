import cn from "clsx";
import { useRouter } from "next/router";
import { ContributeLinks, TableOfContent, TableOfContentProps } from "../ui";

export type TutorialTableOfContentProps = {
  headers: TableOfContentProps["headers"];
  maxWidth?: string;
};

export const TutorialTableOfContent = ({
  headers,
  maxWidth,
}: TutorialTableOfContentProps) => {
  const router = useRouter();
  return (
    <div className={cn("sticky top-[160px] pr-4", maxWidth)}>
      <div className="flex h-full flex-col overflow-auto">
        <TableOfContent headers={headers} />
        <ContributeLinks
          githubEditUrl={
            "https://github.com/instill-ai/instill.tech/edit/main" +
            router.asPath +
            ".mdx"
          }
        />
      </div>
    </div>
  );
};
