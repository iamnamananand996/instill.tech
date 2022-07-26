import { FC } from "react";
import cn from "clsx";
import { ViewJobsScrollButton } from "./buttons";

interface Props {
  /** Because we have ViewJobsScrollButton under this component, we have to provide related
   * Scroll handler.
   * 
   * This function will scroll pageView to targetRef 
   * 
   *  @Example
   * 
   *  ```
   *  const handleScroll = useCallback(() => {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }, []);
      ```
   * 
  */
  viewJobsScrollHandler: () => void;

  marginBottom: string;
}

export const CareerHero: FC<Props> = ({
  marginBottom,
  viewJobsScrollHandler,
}) => {
  const subHeaderStyle =
    "text-lg leading-[27px] text-instillGrey05 mx-auto font-sans md:font-light md:text-2xl md:leading-10 text-center";
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-y-10 px-4 pt-10 pb-10 md:px-0 md:pt-[100px]",
        marginBottom
      )}
    >
      <h1 className="instill-text-h1 w-full text-center text-instillGrey05">
        Come together
      </h1>
      <div className="flex w-full flex-col md:hidden">
        <p className={subHeaderStyle}>
          We can&#39;t build our vision alone. Take a look below for your new
          favorite job.
        </p>
      </div>
      <div className="hidden w-full md:flex md:flex-col ">
        <p className={subHeaderStyle}>We can&#39;t build our vision alone.</p>
        <p className={subHeaderStyle}>
          Take a look below for your new favorite job.
        </p>
      </div>
      <ViewJobsScrollButton
        scrollHandler={viewJobsScrollHandler}
        position="mx-auto"
      />
    </div>
  );
};