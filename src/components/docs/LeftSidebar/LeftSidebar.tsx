import { Section } from "./Section";
import { Sidebar } from "@/types/docs";
import Link from "next/link";

export type LeftSidebarProps = {
  leftSidebar: Sidebar["leftSidebar"];
  footerViewHeight: number;
};

export const LeftSidebar = ({
  leftSidebar,
  footerViewHeight,
}: LeftSidebarProps) => {
  return (
    <>
      <style>
        {`
        .leftsidebar-logo {
          min-height: var(--docs-left-sidebar-logo-height);
          margin-bottom: var(--docs-left-sidebar-logo-margin-bottom)
        }

        .left-sidebar {
          max-width: var(--docs-left-sidebar-max-width);
          height: calc(100vh - ${footerViewHeight}px)
        }
      `}
      </style>
      <div className="left-sidebar flex h-screen w-full flex-col overflow-auto px-8 pb-10 md:sticky md:top-0 md:ml-auto">
        {leftSidebar.logo ? (
          <Link
            href={leftSidebar.logo?.href}
            className="leftsidebar-logo hidden w-full gap-x-3 py-4 md:flex md:flex-row"
          >
            {leftSidebar.logo?.element}
          </Link>
        ) : null}
        {leftSidebar.sections.map((section) => (
          <div key={section.text} className="w-full">
            <Section
              items={section.items}
              text={section.text}
              collapsible={section.collapsible}
              link={section.link}
            />
          </div>
        ))}
      </div>
    </>
  );
};
