/**
 * A React component that renders a header box with a title, optional user greeting, and subtext.
 *
 * @param {HeaderBoxProps} props - The props for the HeaderBox component.
 * @param {string} [props.type="title"] - The type of header box, either "title" or "greeting".
 * @param {string} props.title - The title to display in the header box.
 * @param {string} [props.user] - The user name to display in the header box if the type is "greeting".
 * @param {string} props.subtext - The subtext to display in the header box.
 * @returns {JSX.Element} - The rendered HeaderBox component.
 */
import { space } from "postcss/lib/list";

const HeaderBox = ({
  type = "title",
  title,
  user,
  subtext,
}: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient"> &nbsp;{user}</span>
        )}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
};

export default HeaderBox;
