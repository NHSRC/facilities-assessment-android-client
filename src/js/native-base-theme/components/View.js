// @flow

import variable from "./../variables/platform";
import PrimaryColors from "../../views/styles/PrimaryColors";

export default (variables /*: * */ = variable) => {
  const viewTheme = {
    ".padder": {
      padding: variables.contentPadding
    }
  };

  return viewTheme;
};
