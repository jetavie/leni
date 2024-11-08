# Changelog

## Version 2.0.0 - "Feint Traces" Update

### Added
- Blacklists can now be timed!
- Configurable duration options (1m, 5m, 15m, 30m, 1h, 6h, 12h, 1d, 3d, 1w, permanent)
- Automatic logging of blacklist expiration in mod logging channels (if you so wish to add such a channel, ex. mod-logs)
- Active blacklist tracking system

### Changed
- Improved slash command structure with predefined duration choices
- Enhanced error handling and logging
- Better feedback messages for moderators
- Updated blacklist embed format with duration information (hurray, no more plain text!)

### Fixed
- "Application not responding" issue in remove-blacklist command (this wasn't working in some cases, sorry)
- Role persistence issues across user reconnects (even if your instance goes down, leni will remember (ദ്ദി ( ᵔ ᗜ ᵔ ))
- Command timeout handling

### Technical Changes (for nerds)
- Added activeBlacklists Map to track timed blacklists
- Implemented parseDuration utility function
- Added timeout cleanup on re-blacklist and manual removal
- Improved interaction response handling (did i type this already?)

### Note
This version represents a major update with breaking changes from v1.x. Server administrators will need to re-deploy commands using the updated deploy-commands.js file.
