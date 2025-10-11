# Changelog

## 2.2.0 - 2025-10-xx

This update improves the _Raw Data_ pages and add a bunch of functionality in preparation for coming iterations of the BNRA.

### Added

- Analists can now choose between matrix and sankey view in the _Raw Data_ risk page
- Consolidated qualitative input for risk matrices is editable in the _Raw Data_ page
- Small letter indicators in the title bar show current environment and indicator versions
- Show scenario descriptions in the direct probability and impact sections of the _Raw Data_ page
- Allow editing qualitative and quantitative input by analists in the direct probability and impact sections of the _Raw Data_ page
- Allow editing qualitative and quantitative input by analists in the indirect probability and impact sections of the _Raw Data_ page
- Show differences between public and dynamic environment in _Raw Data_ page
- Show differences between qualitative inputs in _Raw Data_ page
- Added _Change Log_ page for analists
- Dynamically update CP matrix values on _Raw Data_ and _Expert Input_ pages according to selected indicator versions
- Added tooltips with intervals in when providing estimates in the _Raw Data_ pages
- Toggle button to hide the potential consequences of an attack scenario in the _Raw Data_ pages
- Added display configuration menu in the _Raw Data_ pages to customize the page

### Changed

- Actor -> Attack cascade values (motivations) are no longer editable in the _Raw Data_ page of attack risk files, use the actor risk files instead to edit these values
- Reordered potential attacks for actors according to relative preference in _Raw Data_

### Fixed

- Dynamic view showed inaccurate CP values in _Risk Data_ page
- Repair _Building structural failure_ scenario display and other scenario storage issues
- Sankeys in _Raw Data_ show CP values instead of M values for non-actor cascades

### Technical

- Added reusable useSavedState hook for storing state values in localStorage
- Deprecated TextInputBox as it longer has any functionality, use HTMLEditor instead
- Keep logs for changes to risk files and risk cascades
- Added CHANGELOG file
