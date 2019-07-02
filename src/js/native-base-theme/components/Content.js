// @flow

import variable from "./../variables/platform";
import PrimaryColors from "../../views/styles/PrimaryColors";

export default (variables /*: * */ = variable) => {
  const contentTheme = {
    flex: 1,
    backgroundColor: PrimaryColors.bodyBackground,
    "NativeBase.Segment": {
      borderWidth: 0,
      backgroundColor: "transparent"
    }
  };

  return contentTheme;
};
