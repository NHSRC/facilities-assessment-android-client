// @flow

import variable from "./../variables/platform";
import PrimaryColors from "../../views/styles/PrimaryColors";

export default (variables /*: * */ = variable) => {
  const tabTheme = {
    flex: 1,
    backgroundColor: PrimaryColors.bodyBackground
  };

  return tabTheme;
};
