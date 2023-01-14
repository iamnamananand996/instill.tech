import { FC, ReactElement, useMemo } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { CH } from "@code-hike/mdx/components";
import { join } from "path";
import glob from "fast-glob";
import { readFile } from "fs/promises";
import remarkFrontmatter from "remark-frontmatter";
import { remark } from "remark";

import {
  BackToPreviousPageLink,
  ContentContainer,
  ArticlePublishInfo,
  ArticleThemeImage,
  HorizontalLine,
  LastEditedInfo,
  PageBase,
  PageHead,
  PageHero,
  ArticleRightSidebar,
  ArticleSimilarPosts,
} from "@/components/ui";
import { TutorialPipelineLabel } from "@/components/tutorial";

import { RightSidebarProps } from "@/components/docs";
import { remarkGetHeaders } from "@/lib/markdown/remark-get-headers.mjs";
import { getCommitMeta } from "@/lib/github";
import { Nullable, TutorialMeta } from "@/types/instill";
import { getAiTaskIconAndLabel } from "@/lib/instill";
import { useElementDimension } from "@/hooks/useElementDimension";
import { prepareTutorials } from "@/lib/instill/prepareTutorials";
import { CommitMeta } from "@/lib/github/type";
import { serializeMdxRemote } from "@/lib/markdown";
import { TutorialBlock } from "@/components/tutorial/TutorialBlock";

type TutorialPageProps = {
  mdxSource: MDXRemoteSerializeResult;
  headers: RightSidebarProps["headers"];
  tutorials: TutorialMeta[];
  commitMeta: Nullable<CommitMeta>;
  currentTutorialMeta: Nullable<TutorialMeta>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tutorialDir = join(process.cwd(), "tutorials");
  const tutorialRelativePaths = glob.sync("**/*.mdx", { cwd: tutorialDir });

  return {
    paths: tutorialRelativePaths.map((path) => ({
      params: {
        path: path.replace(".mdx", "").split("/"),
      },
    })),

    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<TutorialPageProps> = async ({
  params,
}) => {
  if (!params || !params.path) {
    return {
      notFound: true,
    };
  }

  let fullPath: string;
  let relativePath: string;

  if (Array.isArray(params.path)) {
    fullPath = join(process.cwd(), "tutorials", ...params.path);
    relativePath = join(...params.path);
  } else {
    fullPath = join(process.cwd(), "tutorials", params.path);
    relativePath = join(params.path);
  }

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
  const mdxSource = await serializeMdxRemote(source, true, theme);

  // Access GitHub API to retrieve the info of Committer
  let commitMeta: Nullable<CommitMeta> = null;

  try {
    commitMeta = await getCommitMeta({
      org: "instill-ai",
      repo: "instill.tech",
      path: "tutorials/" + relativePath + ".mdx",
    });
  } catch (err) {
    console.log(err);
  }

  // We use remark to get the headers

  const headers = [] as RightSidebarProps["headers"];

  await remark()
    .use(remarkFrontmatter)
    .use(remarkGetHeaders, { headers })
    .process(source);

  // We need all the tutorials data
  const tutorials = await prepareTutorials();

  return {
    props: {
      mdxSource,
      headers,
      tutorials,
      commitMeta,
      currentTutorialMeta:
        tutorials.find((e) => e.slug === relativePath) || null,
    },
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

const TutorialPage: FC<TutorialPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ mdxSource, commitMeta, headers, tutorials, currentTutorialMeta }) => {
  const { icon, label } = getAiTaskIconAndLabel({
    aiTask: currentTutorialMeta?.aiTask || null,
  });

  const [articleContainerRef, articleContainerDimension] =
    useElementDimension();

  const similarTutorials = useMemo(() => {
    if (!currentTutorialMeta) return [];

    return tutorials.filter(
      (e) =>
        e.useCase === currentTutorialMeta.useCase &&
        e.title !== currentTutorialMeta.title
    );
  }, [tutorials, currentTutorialMeta]);

  return (
    <>
      <PageHead
        pageTitle={
          currentTutorialMeta
            ? `${currentTutorialMeta.title} | Tutorial`
            : "Tutorial"
        }
        pageDescription={
          currentTutorialMeta ? currentTutorialMeta.description : ""
        }
        pageType="main"
      />
      <ContentContainer
        margin="mt-[60px] mb-[120px] xl:my-40"
        contentMaxWidth="max-w-[1127px]"
      >
        <div className="mx-auto flex w-full flex-col xl:max-w-[800px]">
          <BackToPreviousPageLink
            url="/tutorials"
            marginBottom="mb-5 xl:mb-10"
          />
          <TutorialPipelineLabel
            icon={icon}
            label={label}
            sourceConnector={currentTutorialMeta?.sourceConnector || null}
            destinationConnector={
              currentTutorialMeta?.destinationConnector || null
            }
            marginBottom="mb-2"
          />
          <PageHero
            headline={currentTutorialMeta ? currentTutorialMeta.title : ""}
            subHeadline={
              currentTutorialMeta ? currentTutorialMeta.description : ""
            }
            headerFontFamily="font-sans"
            marginBottom="mb-3"
            width="max-w-[1127px]"
            position="mr-auto"
            headerColor="text-instillGrey95"
            gapY="gap-y-[30px]"
            headerUppercase={false}
          />
          <ArticlePublishInfo
            author={currentTutorialMeta ? currentTutorialMeta.author : ""}
            authorAvatarSrc={
              currentTutorialMeta ? currentTutorialMeta.authorAvatarSrc : ""
            }
            publishedOn={
              currentTutorialMeta ? currentTutorialMeta.publishedOn : ""
            }
            authorGitHubUrl={
              currentTutorialMeta ? currentTutorialMeta.authorGitHubUrl : ""
            }
            marginBottom="mb-10"
          />
          <ArticleThemeImage
            imgSrc={currentTutorialMeta?.themeImgSrc || null}
            placeholderColor={
              currentTutorialMeta?.placeholderColor || "bg-instillBlue50"
            }
            marginBottom="mb-20 xl:mb-40"
          />
          <div
            ref={articleContainerRef}
            className="relative mb-20 flex h-full flex-row"
          >
            <article
              id="content"
              className="prose prose-black mr-auto w-full max-w-none"
            >
              <MDXRemote {...mdxSource} components={{ CH }} />
            </article>
          </div>
          {commitMeta ? (
            <>
              <LastEditedInfo meta={commitMeta} marginBottom="mb-4" />
              <HorizontalLine bgColor="bg-instillGrey20" marginBottom="mb-20" />
            </>
          ) : null}
        </div>

        {/* 
          The section for Similar use cases
        */}

        <div>
          {currentTutorialMeta?.useCase ? (
            <ArticleSimilarPosts
              sectionTitle="Similar Use Cases"
              similarArticles={similarTutorials}
              getCardElement={(source, key) => {
                return (
                  <TutorialBlock key={key} tutorial={source as TutorialMeta} />
                );
              }}
            />
          ) : null}
        </div>

        {/* 
          In current design, we want to make table of content align with the 
          article container.
        */}

        <div
          className="absolute hidden max:block"
          style={{
            top: `${articleContainerDimension.y}px`,
            left: `${
              articleContainerDimension.x + articleContainerDimension.width + 40
            }px`,
            height: articleContainerDimension.height - 100,
          }}
        >
          <ArticleRightSidebar headers={headers} maxWidth="max-w-[300px]" />
        </div>
      </ContentContainer>
    </>
  );
};

TutorialPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default TutorialPage;