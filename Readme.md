# Build Status
[![Build Status](https://snap-ci.com/NHSRC/facilities-assessment-android-client/branch/master/build_image)](https://snap-ci.com/NHSRC/facilities-assessment-android-client/branch/master)

# Code Quality
[![Code Climate](https://codeclimate.com/github/NHSRC/facilities-assessment-android-client/badges/gpa.svg)](https://codeclimate.com/github/NHSRC/facilities-assessment-android-client)   [![Test Coverage](https://codeclimate.com/github/NHSRC/facilities-assessment-android-client/badges/coverage.svg)](https://codeclimate.com/github/NHSRC/facilities-assessment-android-client/coverage)  [![Dependency Status](https://gemnasium.com/badges/github.com/NHSRC/facilities-assessment-android-client.svg)](https://gemnasium.com/github.com/NHSRC/facilities-assessment-android-client)

# Bintray
[ ![Download](https://api.bintray.com/packages/nhsrc/generic/facilities-assessment-android-client/images/download.svg) ](https://bintray.com/nhsrc/generic/facilities-assessment-android-client/_latestVersion)

# License
[![License](https://img.shields.io/badge/license-AGPL-green.svg?style=flat)](https://github.com/nhsrc/facilities-assessment-android-client/blob/master/LICENSE)

# Dev setup
If you are setting up the machine for the first time, make sure you have homebrew
installed. If you have homebrew installed just run
`make install` from the root of this repository.


# Running
To run the application `make run-android`

# Running tests in Intellij
* Install NodeJS plugin in Intellij
* Open the Mocha Run & Debug Configurations
* Set environment variable as `npm_package_scripts_test=test`
* Set Extra Mocha Options as `--require react-native-mock/mock.js --require src/test/testHelper.js`
* Set Node Interpreter as the project node
* Set the Working Directory to the project root
* User interface to `bdd`
