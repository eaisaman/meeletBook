# meeletBook - display book content generated on meelet platform

## Note
Upgrade React Native may cause some base class not compatible with that of previous version, which make some components unable to build successfully or run as expected. A proper code merge is done and recorded below for future reference:

- Merge code on RCTConvert.m from 0.11.0 to 0.12.0
  Color hex, rgb, rgba value of string type or colr name string cannot be processed in version 0.12.0
