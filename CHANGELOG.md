# Changelog

## Version 2.0.0 - "Feint Traces" Update

### Added
- Timed blacklist system with automatic role removal
- Configurable duration options (1m, 5m, 15m, 30m, 1h, 6h, 12h, 1d, 3d, 1w, permanent)
- Automatic logging of blacklist expiration in mod-logs
- Active blacklist tracking system
- DM notifications for blacklist expiration

### Changed
- Improved slash command structure with predefined duration choices
- Enhanced error handling and logging
- Better feedback messages for moderators
- Updated blacklist embed format with duration information

### Fixed
- "Application not responding" issue in remove-blacklist command
- Role persistence issues across user reconnects
- Command timeout handling

### Technical Changes
- Added activeBlacklists Map to track timed blacklists
- Implemented parseDuration utility function
- Added timeout cleanup on re-blacklist and manual removal
- Improved interaction response handling

### Requirements
- Requires 'Staff' role (or similar) for command usage
- Requires 'Blacklisted' role to be created in server
- Requires 'mod-logs' channel for logging (optional!)

### Note
This version represents a major update with breaking changes from v1.x. Server administrators will need to re-deploy commands using the updated deploy-commands.js file.
