import { FC } from "react";
import { LinkBase } from "./LinkBase";
import * as classNames from "classnames";

interface Props {
  /** Color and width - tailwindCSS based, default: w-4 text-instillGray30 */
  styleName?: string;
}

export const GithubTextLink: FC<Props> = ({ styleName }) => {
  const style = styleName
    ? styleName
    : "instill-text-body text-instillGray30 hover:text-instillGray05";

  return (
    <LinkBase
      styleName={classNames.default("flex", style)}
      href="https://github.com/instill-ai"
    >
      <p className="my-auto">GitHub</p>
    </LinkBase>
  );
};