## Icons ##

Icon fonts are generated from folders of SVG files.

Placing an svg file in the gw folder, or in the fa5 folder, and then running the font build process will update the various font files, and SASS mappings

### To use an existing icon glyph in a PCF ###
1. In PCF set the icon name field to the name of the svg file
2. Set the icon Type to the correct setting. svgFile for the standard gw font, gwFontGlyph for the (currently setup as Font Awesome 5 Free), or the customer option if you've added a completely new font face.

### To use an existing icon in SASS ###
1. Almost every icon in the client, defined via SASS, will have a global themeable variable
- meaning, if it's an icon in the north panel, not defined via PCF, then look in `NorthPanel_themeable.scss` and you'll likely find something like `gw-NorthPanel--unsaved-work-icon-glyph: "bookmark" !default;`
- override the variable in you theme file to point to another icon glyph. If it's a gw icon, just use the glyph name, if it's a FontAwesome glyph, use the name for regular, or name-solid for solid, or name-light for light

### To add a new icon glyph ###
- Add the icon.svg file to the gw folder
1. Install NodeJS locally
2. Navigate to this folder via a command line
3. execute `npm install`
4. When complete, execute `npm run font`
5. This will generate new font files and sass mappings

### Adding Support for FontAwesome5 Pro ###
- Purchase a license from FontAwesome for the Pro fonts
1. Download the svg files from FontAwesome
2. Add them to the fa5 folders
3. Run the "to add a new icon glyph" instructions


### Printing and Icons ###
-If you add new icons, and plan to include them in sections of the application that will be printed,
you'll need to run:
1. `npm run png-svg` or `npm run png-customer` 
