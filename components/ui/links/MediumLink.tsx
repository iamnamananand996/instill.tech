import { FC } from "react";
import { MediumIcon } from "../icons/MediumIcon";
import { LinkBase } from "./LinkBase";
import * as classNames from "classnames";

interface Props {
  /** Color and width - tailwindCSS based, default: w-4 text-instillGray30 */
  styleName?: string;
  href: string;
}

export const MediumLink: FC<Props> = ({ styleName, href }) => {
  const style = styleName ? styleName : "w-4 text-instillGray30";
  return (
    <LinkBase styleName={classNames.default("flex", style)} href={href}>
      <MediumIcon />
    </LinkBase>
  );
};