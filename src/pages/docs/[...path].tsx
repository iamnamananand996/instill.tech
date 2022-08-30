import { FC, ReactElement, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { join } from "path";
import glob from "fast-glob";
import remarkDirective from "remark-directive";
import { remarkCodeHike } from "@code-hike/mdx";
import remarkGfm from "remark-gfm";
import { CH } from "@code-hike/mdx/components";
import { useRouter } from "next/router";
import { h } from "hastscript";
import { readFile } from "fs/promises";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFrontmatter from "remark-frontmatter";
import { remark } from "remark";

import { PageHead } from "@/components/ui";
import { DocsLayout, RightSidebar, RightSidebarProps } from "@/components/docs";
import docsConfig from "../../../docs.config";
import { remarkInfoBlock } from "@/lib/markdown/remark-info-block.mjs";
import { remarkYoutube } from "@/lib/markdown/remark-youtube.mjs";
import {
  infoBlockHeader,
  infoBlockChildren,
} from "@/lib/markdown/rehype-info-block-handler.mjs";
import { remarkGetHeaders } from "@/lib/markdown/remark-get-headers.mjs";
import { SidebarItem } from "@/types/docs";
import { ArticleNavigationButton } from "@/components/docs";
import { getRepoFileCommits } from "@/lib/github";
import { Nullable } from "@/types/instill";

type DocsParams = {
  params: {
    path: string[];
  };
};

type DocsPageProps = {
  mdxSource: MDXRemoteSerializeResult;
  nextArticle: SidebarItem;
  prevArticle: SidebarItem;
  lastEditedTime: Nullable<string>;
  author: Nullable<string>;
  authorGithubUrl: Nullable<string>;
  headers: RightSidebarProps["headers"];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const docsDir = join(process.cwd(), "docs");
  const docsPaths = glob.sync("**/*.mdx", { cwd: docsDir });

  return {
    paths: docsPaths.map((path) => ({
      params: {
        path: path.replace(".mdx", "").split("/"),
      },
    })),

    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DocsPageProps> = async ({
  params,
}: DocsParams) => {
  const fullPath = join(process.cwd(), "docs", ...params.path);
  const relativePath = join(...params.path);
  const source = fs.readFileSync(fullPath + ".mdx", "utf8");

  // Prepare the codeHike theme

  const theme = JSON.parse(
    await readFile(
      join(process.cwd(), "src", "styles", "rose-pine-moon.json"),
      {
        encoding: "utf-8",
      }
    )
  );

  // Serialize the mdx file for client

  const mdxSource = await serialize(source, {
    parseFrontmatter: true,
    mdxOptions: {
      useDynamicImport: true,
      remarkPlugins: [
        [
          remarkCodeHike,
          {
            theme,
            lineNumbers: false,
            showCopyButton: true,
            autoImport: false,
          },
        ],
        remarkDirective,
        remarkInfoBlock,
        [remarkYoutube, { validateYoutubeLink: true }],
        remarkGfm,
      ],
      rehypePlugins: [
        [remarkRehype, { handlers: { infoBlockHeader, infoBlockChildren } }],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "prepend",
            properties: { class: "heading-anchor" },
            content() {
              return h("span", { class: "heading-anchor-hash" }, ["#"]);
            },
          },
        ],
      ],
    },
  });

  // Get prev and next link from sidebar config

  const sidebarLinks: SidebarItem[] = [].concat(
    ...docsConfig.sidebar.leftSidebar.sections.map((e) => e.items)
  );

  const currentPageIndex = sidebarLinks.findIndex(
    (e) => e.link === "/docs/" + relativePath
  );

  const nextArticle =
    currentPageIndex + 1 >= sidebarLinks.length
      ? null
      : sidebarLinks[currentPageIndex + 1];

  const prevArticle =
    currentPageIndex - 1 < 0 ? null : sidebarLinks[currentPageIndex - 1];

  // Access GitHub API to retrieve the info of Committer

  const commits = await getRepoFileCommits(
    "instill-ai",
    "instill.tech",
    "docs/" + relativePath + ".mdx"
  );

  let lastEditedTime: Nullable<string> = null;
  let author: Nullable<string> = null;
  let authorGithubUrl: Nullable<string> = null;

  if (commits.length > 0) {
    const time = new Date(commits[0].commit.author.date).toLocaleString();

    lastEditedTime = time;
    author = commits[0].commit.author.name;
    authorGithubUrl = commits[0].author.html_url;
  }

  // We use remark to correctly get the headers

  let headers = [] as RightSidebarProps["headers"];

  await remark()
    .use(remarkFrontmatter)
    .use(remarkGetHeaders, { headers })
    .process(source);

  return {
    props: {
      mdxSource,
      nextArticle,
      prevArticle,
      lastEditedTime,
      author,
      authorGithubUrl,
      headers,
    },
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

const DocsPage: FC<DocsPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({
  mdxSource,
  nextArticle,
  prevArticle,
  lastEditedTime,
  author,
  authorGithubUrl,
  headers,
}) => {
  const router = useRouter();

  return (
    <>
      <PageHead
        pageTitle={`${mdxSource.frontmatter.title} | Documentation`}
        pageDescription={mdxSource.frontmatter.description}
        pageType="docs"
      />
      <div className="grid grid-cols-8">
        <div className="col-span-8 xl:col-span-6 px-6 md:px-8 max:px-16">
          <h1 className="font-sans font-semibold text-3xl mb-10">
            {mdxSource.frontmatter.title}
          </h1>
          <article id="content" className="prose prose-black max-w-none mb-20">
            <MDXRemote {...mdxSource} components={{ CH }} />
          </article>
          <div className="flex flex-row gap-x-2 w-full pb-6 mb-8 border-b">
            {lastEditedTime && author ? (
              <>
                <p className="ml-auto text-sm text-instillGrey70">
                  {`Last updated: ${lastEditedTime}`}
                </p>
                <div className="flex flex-row gap-x-1 text-sm ">
                  <p className="text-instillGrey70">by</p>
                  <a
                    className="text-instillBlue50 underline"
                    href={authorGithubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {author}
                  </a>
                </div>
              </>
            ) : null}
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-x-5">
            {prevArticle ? (
              <ArticleNavigationButton
                type="prev"
                link={prevArticle.link}
                text={prevArticle.text}
              />
            ) : (
              <div />
            )}
            {nextArticle ? (
              <ArticleNavigationButton
                type="next"
                link={nextArticle.link}
                text={nextArticle.text}
              />
            ) : (
              <div />
            )}
          </div>
        </div>

        <aside className="hidden xl:block xl:col-span-2">
          <RightSidebar
            githubEditUrl={
              "https://github.com/instill-ai/instill.tech/edit/main/src/pages" +
              router.asPath +
              ".mdx"
            }
            headers={headers}
          />
        </aside>
      </div>
    </>
  );
};

DocsPage.getLayout = (page) => {
  return <DocsLayout>{page}</DocsLayout>;
};

export default DocsPage;