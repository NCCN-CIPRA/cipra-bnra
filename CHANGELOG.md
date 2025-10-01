# Changelog

## 2.2.0 - 2025-10-xx

### Added

- Analists can now choose between matrix and sankey view in the _Raw Data_ risk page
- Consolidated qualitative input for risk matrices is editable in the _Raw Data_ page
- Small letter indicators in the title bar show current environment and indicator versions

### Changed

- Actor -> Attack cascade values (motivations) are no longer editable in the _Raw Data_ page of attack risk files, use the actor risk files instead to edit these values

### Technical

- Added reusable useSavedState hook for storing state values in localStorage
- Deprecated TextInputBox as it longer has any functionality, use HTMLEditor instead
