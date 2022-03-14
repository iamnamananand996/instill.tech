import { FC, ReactElement } from "react";
import { MagicFlowDestinationIcon } from "./icons/MagicFlowDestinationIcon";
import { MagicFlowKernelIcon } from "./icons/MagicFlowKernelIcon";
import { MagicFlowSourceIcon } from "./icons/MagicFlowSourceIcon";
import { MagicFlow } from "./svgs/animations/MagicFlow";

interface Props {}

type BannerCopy = {
  id: string;
  title: string;
  description: string;
  icon: ReactElement;
};

export const LandingBanner: FC<Props> = () => {
  const bannerCopy: BannerCopy[] = [
    {
      id: "banner-copy-1",
      title: "UNSTRUCTURED VISUAL DATA",
      description: "Ingest image and video data with pre-built data connectors",
      icon: <MagicFlowSourceIcon styleName="w-[60px] h-[63px]" />,
    },
    {
      id: "banner-copy-2",
      title: "VISION AI PROCESSOR",
      description:
        "Transform unstructured data into structured insights with ready-to-use Vision AI models",

      icon: <MagicFlowKernelIcon styleName="w-[65px] h-[42px]" />,
    },
    {
      id: "banner-copy-3",
      title: "STRUCTURED DATA",
      description:
        "Send structured insights to data warehouses and applications for future analysis or workflow automation",

      icon: <MagicFlowDestinationIcon styleName="w-[60px] h-[63px]" />,
    },
  ];

  return (
    <div
      id="landing-page-banner"
      className="grid grid-cols-1 lg:grid-cols-2 max-w-[1440px] lg:w-11/12 mx-auto mb-8 max-h-screen"
    >
      <div className="flex flex-col max-h-screen py-5">
        <MagicFlow styleName="flex mx-auto h-full" />
      </div>
      <div className="max-h-screen md:my-auto hidden lg:grid lg:grid-rows-3">
        {bannerCopy.map((copy) => (
          <div
            key={copy.id}
            className="flex flex-col pt-5 pb-5 pr-5 gap-y-5 justify-center max-w-[456px]"
          >
            <div>{copy.icon}</div>
            <h2 className="text-instillGray05 font-instill text-4xl">
              {copy.title}
            </h2>
            <p className="text-instillGray05 instill-text-body">
              {copy.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};