import { TPositionDetails } from "@/types/instill";
import { FC } from "react";
import cn from "clsx";
import PositionInfo from "./PositionInfo";
import PositionDescription from "./PositionDescription";

export type CareerPositionDetailsSectionProps = {
  marginBottom: string;
  position: TPositionDetails;
};

const CareerPositionDetailsSection: FC<CareerPositionDetailsSectionProps> = ({
  marginBottom,
  position,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-20 md:flex-row md:gap-y-0 md:gap-x-6",
        marginBottom
      )}
    >
      <PositionInfo
        padding="px-4 md:px-0"
        width="md:w-4/12"
        position={position}
      />
      <PositionDescription
        padding="px-4 md:px-10"
        width="md:w-8/12"
        description={position.description}
      />
    </div>
  );
};

export default CareerPositionDetailsSection;