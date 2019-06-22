# Livestreaming browser.
A simple electron/chromium based browser built specifically for making window capture easy through screen capture utilities, such as OBS or google hangouts.

> Normal browsers work fine for every day use, but since most of them bypass windows GDI layer, they won't show up in "window capture" mode on the windows operating system.

There are also a few tweaks to make things easier for streaming. For instance, the URL bar is hidden by default so you can have a better view of the entire webpage.

On top of the custom tweaks, there's also no browser history, no user accounts, and no emails or other tabs to leak. Although the `localstorage` and `cookies` methods for websites to store temporary data like keeping you logged into a website and analytics tracking will still work.

# Usage

[Download the latest release](https://github.com/CalebBabin/screenshare-browser/releases/tag/beta)

And for now, the workaround to enable window capture on windows, is to right click the executable, then click > Properties > Compatibility > Run this program in Compatibility mode for: > Windows 8 > Ok.

This workaround also works for other applications, going forward there may be a more streamlined workaround to enabling window capture, but until then this is the only way I've found so far.

Once you have it running, press `F12` to drop down the navigation menu. In the future there will be configurable controls.


# State of the codebase
Yes, it's messy. Really messy. I downloaded a kind of terrible example project as a starting point, and mostly hacked together features into it. I plan on fully restructuring the codebase in the future.