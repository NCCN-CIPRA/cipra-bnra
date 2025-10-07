# Changelog

## 2.2.0 - 2025-10-xx

### Added

- Analists can now choose between matrix and sankey view in the _Raw Data_ risk page
- Consolidated qualitative input for risk matrices is editable in the _Raw Data_ page
- Small letter indicators in the title bar show current environment and indicator versions
- Show scenario descriptions in the direct probability and impact sections of the _Raw Data_ page
- Allow editing qualitative and quantitative input by analists in the direct probability and impact sections of the _Raw Data_ page
- Allow editing qualitative and quantitative input by analists in the indirect probability and impact sections of the _Raw Data_ page

### Changed

- Actor -> Attack cascade values (motivations) are no longer editable in the _Raw Data_ page of attack risk files, use the actor risk files instead to edit these values
- Reordered potential attacks for actors according to relative preference

### Fixed

- Dynamic view showed inaccurate CP values in _Risk Data_ page
- Repair _Building structural failure_ scenario display and other scenario storage issues
- Sankeys in _Raw Data_ show CP values instead of M values for non-actor cascades

### Technical

- Added reusable useSavedState hook for storing state values in localStorage
- Deprecated TextInputBox as it longer has any functionality, use HTMLEditor instead
